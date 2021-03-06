pragma solidity ^0.4.24;

contract rps
{
   mapping (string => mapping(string => int)) payoffMatrix;
   address player1;
   address player2;
   string public player1Choice;
   string public player2Choice;

   modifier notRegisteredYet()
   {
       if (msg.sender == player1 || msg.sender == player2)
           revert();
       else
           _;
   }

   modifier sentEnoughCash(uint amount)
   {
       if (msg.value < amount)
           revert();
       else
           _;
   }

   constructor () public
   {   // constructor
       payoffMatrix["rock"]["rock"] = 0;
       payoffMatrix["rock"]["paper"] = 2;
       payoffMatrix["rock"]["scissors"] = 1;
       payoffMatrix["paper"]["rock"] = 1;
       payoffMatrix["paper"]["paper"] = 0;
       payoffMatrix["paper"]["scissors"] = 2;
       payoffMatrix["scissors"]["rock"] = 2;
       payoffMatrix["scissors"]["paper"] = 1;
       payoffMatrix["scissors"]["scissors"] = 0;
   }

   function getWinner() constant public returns (int x)
   {
       return payoffMatrix[player1Choice][player2Choice];
   }

   function setPlayer2Choice(string choice) public returns (bool x)
   {
       player2Choice = choice;
       return true;
   }

   function play(string choice) public returns (int w)
   {
       if (msg.sender == player1)
           player1Choice = choice;
       else if (msg.sender == player2)
           player2Choice = choice;
       if (bytes(player1Choice).length != 0 && bytes(player2Choice).length != 0)
       {
           int winner = payoffMatrix[player1Choice][player2Choice];
           if (winner == 1)
               player1.transfer(address(this).balance);
           else if (winner == 2)
               player2.transfer(address(this).balance);
           else
           {
               player1.transfer(address(this).balance/2);
               player2.transfer(address(this).balance/2);
           }

           // unregister players and choices
           player1Choice = "";
           player2Choice = "";
           player1 = 0;
           player2 = 0;
           return winner;
       }
       else
           return -1;
   }

// HELPER FUNCTIONS (not required for game)

   function getMyBalance () constant public returns (uint amount)
   {
       return msg.sender.balance;
   }

   function getContractBalance () constant public returns (uint amount)
   {
       return address(this).balance;
   }

   function register() public
       sentEnoughCash(5)
       notRegisteredYet()
       payable
   {
       if (player1 == 0)
           player1 = msg.sender;
       else if (player2 == 0)
           player2 = msg.sender;
   }

   function AmIPlayer1() constant public returns (bool x)
   {
       return msg.sender == player1;
   }

   function AmIPlayer2() constant public returns (bool x)
   {
       return msg.sender == player2;
   }

   function whoIsPlayer1() constant public returns (address x)
   {
       return player1;
   }


   function checkBothNotNull() constant public returns (bool x)
   {
       return (bytes(player1Choice).length == 0 && bytes(player2Choice).length == 0);
   }


}
