const ItemMarketPlace = artifacts.require("ItemMarketPlace")
const { catchRevert } = require("./utils/exceptions")

// Mocha - testing framework
// Chai - assertion JS library

contract("ItemMarketPlace", accounts => {

  const ItemId = "0x00000000000000000000000000003130"
  const proof = "0x0000000000000000000000000000313000000000000000000000000000003130"
  const value = "900000000"
  const ItemId2 = "0x00000000000000000000000000002130"
  const proof2 = "0x0000000000000000000000000000213000000000000000000000000000002130"
  const getBalance = async address => web3.eth.getBalance(address)
  const toBN = value => web3.utils.toBN(value)
  const getGas = async result => {
    const tx = await web3.eth.getTransaction(result.tx)
    const gasUsed = toBN(result.receipt.gasUsed)
    const gasPrice = toBN(tx.gasPrice)
    const gas = gasUsed.mul(gasPrice)
    return gas
  }

  let _contract = null
  let contractOwner = null
  let buyer = null
  let ItemHash = null

  before(async () => {
    _contract = await ItemMarketPlace.deployed()
    contractOwner = accounts[0]
    buyer = accounts[1]
  })

  describe("Purchase the new item", () => {

    before(async() => {
      await _contract.purchaseItem(ItemId, proof, {
        from: buyer,
        value
      })
    })

    it("should NOT allow to repurchase already owned item", async () => {
      await catchRevert(_contract.purchaseItem(ItemId, proof, {
        from: buyer,
        value
      }))
    })

    it("can get the purchased item hash by index", async () => {
      const index = 0
      ItemHash = await _contract.getItemHashAtIndex(index)
      const expectedHash = web3.utils.soliditySha3(
        { type: "bytes16", value: ItemId },
        { type: "address", value: buyer },
      )

      assert.equal(ItemHash, expectedHash, "Item hash is not maching the hash of purchased item!")
    })

    it("should match the data of the item purchased by buyer", async () => {
      const exptectedIndex = 0
      const exptectedState = 0
      const item = await _contract.getItemByHash(ItemHash)

      assert.equal(item.id, exptectedIndex, "Item index should be 0!")
      assert.equal(item.price, value, `Item price should be ${value}!`)
      assert.equal(item.proof, proof, `Item proof should be ${proof}!`)
      assert.equal(item.owner, buyer, `Item buyer should be ${buyer}!`)
      assert.equal(item.state, exptectedState, `Item state should be ${exptectedState}!`)
    })
  })

  describe("Activate the purchased item", () => {

    it("should NOT be able to activate item by NOT contract owner", async () => {
      await catchRevert(_contract.activateItem(ItemHash, {from: buyer}))
    })

    it("should have 'activated' state", async () => {
      await _contract.activateItem(ItemHash, {from: contractOwner})
      const item = await _contract.getItemByHash(ItemHash)
      const exptectedState = 1

      assert.equal(item.state, exptectedState, "Item should have 'activated' state")
    })
  })


  describe("Transfer ownership", () => {
    let currentOwner = null

    before(async() => {
      currentOwner = await _contract.getContractOwner()
    })

    it("getContractOwner should return deployer address", async () => {
      assert.equal(
        contractOwner,
        currentOwner,
        "Contract owner is not matching the one from getContractOwner function"
      )
    })

    it("should NOT transfer ownership when contract owner is not sending TX", async () => {
      await catchRevert(_contract.transferOwnership(accounts[3], {from: accounts[4]}))
    })

    it("should transfer owership to 3rd address from 'accounts'", async () => {
      await _contract.transferOwnership(accounts[2], {from: currentOwner})
      const owner = await _contract.getContractOwner()
      assert.equal(owner, accounts[2], "Contract owner is not the second account")
    })

    it("should transfer owership back to initial contract owner'", async () => {
      await _contract.transferOwnership(contractOwner, {from: accounts[2]})
      const owner = await _contract.getContractOwner()
      assert.equal(owner, contractOwner, "Contract owner is not set!")
    })
  })

  describe("Deactivate Item", () => {
    let ItemHash2 = null
    let currentOwner = null

    before(async () => {
      await _contract.purchaseItem(ItemId2, proof2, {from: buyer, value})
      ItemHash2 = await _contract.getItemHashAtIndex(1)
      currentOwner = await _contract.getContractOwner()
    })

    it("should NOT be able to deactivate the Item by NOT contract owner", async () => {
      await catchRevert(_contract.deActivateItem(ItemHash2, {from: buyer}))
    })

    it("should have status of deactivated and price 0", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer)
      const beforeTxContractBalance = await getBalance(_contract.address)
      const beforeTxOwnerBalance = await getBalance(currentOwner)

      const result = await _contract.deActivateItem(ItemHash2, {from: contractOwner})

      const afterTxBuyerBalance = await getBalance(buyer)
      const afterTxContractBalance = await getBalance(_contract.address)
      const afterTxOwnerBalance = await getBalance(currentOwner)

      const Item = await _contract.getItemByHash(ItemHash2)
      const exptectedState = 2
      const exptectedPrice = 0
      const gas = await getGas(result)

      assert.equal(Item.state, exptectedState, "Item is NOT deactivated!")
      assert.equal(Item.price, exptectedPrice, "Item price is not 0!")
      assert.equal(
        toBN(beforeTxOwnerBalance).sub(gas).toString(),
        afterTxOwnerBalance,
        "Contract owner balance is not correct"
      )

      assert.equal(
        toBN(beforeTxBuyerBalance).add(toBN(value)).toString(),
        afterTxBuyerBalance,
        "Buyer ballance is not correct"
      )

      assert.equal(
        toBN(beforeTxContractBalance).sub(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract ballance is not correct"
      )
    })

    it("should NOT be able activate deactivated Item", async () => {
      await catchRevert(_contract.activateItem(ItemHash2, {from: contractOwner}))
    })
  })

  describe("Repurchase Item", () => {
    let ItemHash2 = null

    before(async () => {
      ItemHash2 = await _contract.getItemHashAtIndex(1)
    })

    it("should NOT repurchase when the Item doesn't exist", async () => {
      const notExistingHash = "0x5ceb3f8075c3dbb5d490c8d1e6c950302ed065e1a9031750ad2c6513069e3fc3"
      await catchRevert(_contract.repurchaseItem(notExistingHash, {from: buyer}))
    })

    it("should NOT repurchase with NOT Item owner", async () => {
      const notOwnerAddress = accounts[2]
      await catchRevert(_contract.repurchaseItem(ItemHash2, {from: notOwnerAddress}))
    })

    it("should be able repurchase with the original buyer", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer)
      const beforeTxContractBalance = await getBalance(_contract.address)
      const result = await _contract.repurchaseItem(ItemHash2, {from: buyer, value})
      const afterTxBuyerBalance = await getBalance(buyer)
      const afterTxContractBalance = await getBalance(_contract.address)

      const Item = await _contract.getItemByHash(ItemHash2)
      const exptectedState = 0
      const gas = await getGas(result)

      assert.equal(Item.state, exptectedState, "The Item is not in purchased state")
      assert.equal(Item.price, value, `The Item price is not equal to ${value}`)

      assert.equal(
        toBN(beforeTxBuyerBalance).sub(toBN(value)).sub(gas).toString(),
        afterTxBuyerBalance,
        "Client balance is not correct!"
      )
      assert.equal(
        toBN(beforeTxContractBalance).add(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract balance is not correct!"
      )
    })

    it("should NOT be able to repurchase purchased Item", async () => {
      await catchRevert(_contract.repurchaseItem(ItemHash2, {from: buyer}))
    })
  })
})