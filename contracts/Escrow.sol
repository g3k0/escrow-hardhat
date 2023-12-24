// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;
    bool public isApproved = false;

    event Approved(uint balance);

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }

    function approve() external payable {
        require(msg.sender == arbiter, "only the arbiter can approve the transaction");

        emit Approved(address(this).balance);
        (bool sent, ) = beneficiary.call{ value: address(this).balance }("");
        require(sent, "Failed to send ether");
        isApproved = true;
    }
}
