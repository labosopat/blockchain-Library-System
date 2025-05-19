// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Library {
    struct Book {
        uint256 id;
        string title;
        uint256 price;
        address borrower;
        bool checkedOut;
        uint dueDate;
    }

    struct User {
        address id;
        string name;
        uint256 balance;
        uint256[] borrowedBooks;
        string mailId;
        bool suspended;
    }

    mapping(uint256 => Book) public books;
    mapping(address => User) public users;
    mapping(uint => address[]) public reservations;

    uint256 public totalBooks;
    uint256 public totalUsers;

    event BookAdded(uint256 indexed bookId, string title);
    event BookCheckedOut(uint256 indexed bookId, address indexed borrower);
    event BookReturned(uint256 indexed bookId);
    event UserAdded(address indexed userId, string name);
    address public token;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    constructor(address _ERC20_ContractAddress) {
        owner = msg.sender;
        token = _ERC20_ContractAddress;
            totalBooks = 0;
            totalUsers = 0;
    }
    

    function addBook(string memory _title, uint256 _price) external onlyOwner {
        totalBooks++;
        books[totalBooks] = Book(totalBooks, _title, _price, address(0), false,0);
        emit BookAdded(totalBooks, _title);
    }

    function addUser(string memory _name,address _Id, uint256 _tokens, string memory _mailId ) external onlyOwner{
        totalUsers++;
        IERC20(token).transferFrom(owner,_Id, _tokens);
        users[_Id] = User(_Id, _name,_tokens,  new uint256[](0), _mailId, false);
        emit UserAdded(msg.sender, _name);
    }
    
    function blockUser(address _user) external onlyOwner{
         users[_user].suspended = true;
    }
    function unBlockUser(address _user) external onlyOwner{
         users[_user].suspended = false;
    }

    function BookIssue(uint256 _bookId) external {
        require(_bookId <= totalBooks && _bookId > 0, "Invalid book ID");
        require(!books[_bookId].checkedOut, "Book already checked out");
        require(users[msg.sender].id != address(0), "User does not exist");
        require(users[msg.sender].suspended = false, "User is blocked");
        address _Id = users[msg.sender].id;
        uint256 bookFee = books[_bookId].price;
         IERC20(token).transferFrom(_Id, owner, bookFee);
        books[_bookId].borrower = msg.sender;
        books[_bookId].dueDate = block.timestamp+1 weeks;
        books[_bookId].checkedOut = true;
        users[msg.sender].balance-= bookFee;
        users[msg.sender].borrowedBooks.push(_bookId);

        emit BookCheckedOut(_bookId, msg.sender);
    }

    function returnBook(uint256 _bookId) external {
        require(_bookId <= totalBooks && _bookId > 0, "Invalid book ID");
        require(books[_bookId].checkedOut, "Book is not checked out");
        require(books[_bookId].borrower == msg.sender, "You are not the borrower");
        address _Id = users[msg.sender].id;
         uint256 bookFee = books[_bookId].price;
         if (books[_bookId].dueDate > block.timestamp){
            IERC20(token).transferFrom(owner ,_Id, 90%bookFee);
         }else {
            IERC20(token).transferFrom(owner ,_Id, bookFee);
         }
 
        books[_bookId].borrower = address(0);
        books[_bookId].checkedOut = false;

        // Remove the book from the borrower's borrowedBooks array
        uint256[] storage borrowedBooks = users[msg.sender].borrowedBooks;
        for (uint256 i = 0; i < borrowedBooks.length; i++) {
            if (borrowedBooks[i] == _bookId) {
                borrowedBooks[i] = borrowedBooks[borrowedBooks.length - 1];
                borrowedBooks.pop();
                break;
            }
  
        }

        emit BookReturned(_bookId);
    }

function transferBook(uint256 _bookId, address _userAddress) external {
        require(_bookId <= totalBooks && _bookId > 0, "Invalid book ID");
        require(books[_bookId].checkedOut, "Book already submited to Library");
        require(users[msg.sender].id != address(0), "User does not exist");

    uint256 bookFee = books[_bookId].price;
    address currentUser =   books[_bookId].borrower;

        IERC20(token).transferFrom(_userAddress, currentUser, bookFee);
        books[_bookId].borrower = _userAddress;
        books[_bookId].dueDate = block.timestamp+1 weeks;
        books[_bookId].checkedOut = true;
        users[msg.sender].balance-= bookFee;
        users[msg.sender].borrowedBooks.push(_bookId);

}

     function reserveBook(uint256 _bookId) external{
        require(books[_bookId].borrower!= address(0), "Book is already borrowed");
        require(isBookReserved(_bookId, msg.sender), "Book is already reserved by the user");
        
        reservations[_bookId].push(msg.sender);
    }

 function isBookReserved(uint _bookId, address _user) internal view returns(bool) {
        address[] memory users = reservations[_bookId];
        for (uint i = 0; i < users.length; i++) {
            if (users[i] == _user) {
                return true;
            }
        }
        return false;
    }

// function tranferToQueue(uint256 _bookId) external {
//     require(books[_bookId].borrower!= address(0), "Book is already borrowed");
//     require(_bookId <= totalBooks && _bookId > 0, "Invalid book ID");
//     require(!books[_bookId].checkedOut, "Book already checked out");
   
//     //address _Id = reservations[_bookId];

//          uint256 bookFee = books[_bookId].price;
//          IERC20(token).transferFrom(_Id, owner, bookFee);
//         books[_bookId].borrower = _Id;
//         books[_bookId].dueDate = block.timestamp+1 weeks;
//         books[_bookId].checkedOut = true;
//         users[msg.sender].balance-= bookFee;
//         users[msg.sender].borrowedBooks.push(_bookId);
     

// }

    function getUserBorrowedBooks(address _userId) external view returns (uint256[] memory) {
        return users[_userId].borrowedBooks;
    }

    function getBookInfo(uint256 _bookId) external view returns (uint256, string memory, address, bool) {
        require(_bookId <= totalBooks && _bookId > 0, "Invalid book ID");
        Book memory book = books[_bookId];
        return (book.id, book.title, book.borrower, book.checkedOut);
    }
}