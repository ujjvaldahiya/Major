const ItemMarketPlace = artifacts.require("ItemMarketPlace")
const { catchRevert } = require("./utils/exceptions")

// Mocha - testing framework
// Chai - assertion JS library

contract("ItemMarketPlace", accounts => {

  const ItemId = "0x00000000000000000000000000003130"
  const proof = "0x0000000000000000000000000000313000000000000000000000000000003130"
  const value = "900000000"

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
})