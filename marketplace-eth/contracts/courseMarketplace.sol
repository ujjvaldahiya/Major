// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketPlace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint id;
        uint price;
        bytes32 proof;
        address owner;
        State state;
    } 

    mapping(bytes32 => Course) private ownedCourses; //courseHash => Course Data
    mapping(uint => bytes32) private ownedCourseHash; //courseID => courseHash

    uint private totalOwnedCourses;

    function purchaseCourse(
        bytes16 courseId,
        bytes32 proof)
        external
        payable
    {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        uint id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({id: id, price: msg.value, proof: proof, owner: msg.sender, state: State.Purchased});
    }

    function getCourseCount()
        external
        view
        returns (uint)
    {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint index)
        external
        view
        returns (bytes32)
    {
        return ownedCourseHash[index];
    }

    function getCourseByHash(bytes32 courseHash)
        external
        view
        returns (Course memory)
    {
        return ownedCourses[courseHash];
    }

}