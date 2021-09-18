//SPDX-License-Identifier: GPL-3.0 
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Item.sol";
contract ItemManager is Ownable{
   
    struct item{
        Item i;
        uint256 price;
        string name;
        state istatus;
    }
    mapping(uint=>item) public itemlist;
    uint256 index;
    enum state{created,paid,delivered}
    event step(uint Index, uint step, address loc);
    function createitem(string memory _name, uint256 _p) public onlyOwner{
        itemlist[index].name=_name;
        itemlist[index].price=_p;
        itemlist[index].istatus=state.created;
        Item itemo=new Item(this,_p,index);
        itemlist[index].i=itemo;
        emit step(index,0,address(itemo));
        index++;
    } 
    function gets(uint256 _i) view public returns(state){
        return itemlist[_i].istatus;
    }
    modifier allt(uint256 _i, uint _s){
        require(gets(_i)==state(_s),"Item is further in the chain");
        _;
    }
    function triggerpayment(uint256 _i) public payable allt(_i,0){
        require(itemlist[_i].price==msg.value,"Full payment required for further process");
        itemlist[_i].istatus=state.paid;
        emit step(_i,1,address(itemlist[_i].i));
    }
         function triggerdelivery(uint256 _i) public allt(_i,1) onlyOwner{
        itemlist[index].istatus=state.delivered;
        emit step(_i,2,address(itemlist[_i].i));
    }
}