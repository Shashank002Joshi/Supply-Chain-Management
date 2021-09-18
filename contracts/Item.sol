//SPDX-License-Identifier: GPL-3.0 
pragma solidity ^0.8.1;
import "./ItemManager.sol";
contract Item {
    bool public paid;
    uint256 public price;
    uint256 public index;
    ItemManager manager;
    
    constructor(ItemManager _m, uint256 _p, uint256 _i){
        price=_p;
        index=_i;
        manager=_m;
    }
    receive() external payable{
       require(!paid,"Item already paid");
       (bool status,)=address(manager).call{value:msg.value}(abi.encodeWithSignature("triggerpayment(uint256)",index)); 
       require(status,"Transaction Unsucessful");
       paid=true;
    }
  fallback() external{}
    
}