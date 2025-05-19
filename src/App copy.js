import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { addBook, getBookInfo, checkOut, addUser, returnBook, getUserBorrowedBooks } from './LibraryContract';

function App() {
  const [bookId, setBookId] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [bookInfo, setBookInfo] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(''); // New state for user ID
  const [initialSupply, setInitialSupply] = useState(''); // New state for initial supply
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [userAddr, setUserAddr] = useState("");
  const [borrowedBooksInfo, setBorrowedBooksInfo] = useState([]);

  useEffect(() => {
    console.log("use effect ");
  });

  const connectWallet = async () => {
    try {
      if(window.ethereum){
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts);
        console.log("connected to account :", accounts);
        const provider = new ethers.BrowserProvider(window.ethereum);

        setProvider(provider);
        setWalletConnected(true);
      }else{
        alert("Please download metamask");
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleAddBook = async () => {
    try{
      await addBook(bookTitle, bookPrice);
    }catch (error) {
      alert('There was error in adding a book, try again.');
      console.error('Error adding a book', error);
    }
  };

  const handleGetBookInfo = async () => {
    try{
      if(bookId === ''){
        alert("Enter a valid Book Id");
      }else{
        const info = await getBookInfo(bookId);
        console.log("info : ", info);
        setBookInfo(info);
      }
    } catch (error) {
      alert("Error in fetching the book details,  try again");
      console.error('Error in getting book info', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const checkout = await checkOut(bookId);
      alert("Successfully checked out!...");
    } catch(error) {
      console.log("error checkout :", error);
      alert("Error in checkout, try again...");
    }
  }

  const handleAddUser = async () => {
    try {
      await addUser(userName, userId, initialSupply); // Pass user ID and initial supply to addUser function
      setUserName(userName, userId, initialSupply);
      alert("Successfully added the user : ");
    } catch(error) {
      alert("Error in adding user, try again...");
    }
  }

  const handleReturnBook = async () => {
    try {
      await returnBook(bookId, );
      alert("Successfully returned book");
    } catch(error) {
      alert("Error in returning book...");
    }
  }

  const handleGetUserBorrowedBooks = async () => {
    try {
      const books = await getUserBorrowedBooks(userAddr);
      console.log("books : ", books);
      setBorrowedBooks(books);
      
      const booksInfo = await Promise.all(books.map(async (bookId) => {
        const info = await getBookInfo(bookId);
        return [bookId, info[1]]; // Returning an array containing book ID and name
      }));
      setBorrowedBooksInfo(booksInfo);
      
      console.log("books array : ", borrowedBooksInfo);
      borrowedBooks.map(m => {
        console.log("book : ", m)
      });
      console.log("books : ", borrowedBooks);
    } catch(error) {
      alert("Error in fetching the data...");
    }
  }

  return (
    <div style={{ backgroundColor: '#0c0942', padding: '20px' }}>
      <header style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: '#94e8ff', textAlign: 'center'}}>Library Management DApp </h1>
        <div style={{textAlign: 'right'}}>
          {!walletConnected ? (
            <button style={{padding: '10px 20px', backgroundColor: '#6760e6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <b style={{color: '#fff'}}>{userAddress}</b>
          )}
        </div>
      </header>
      <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Book Title" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
        <input type="number" placeholder="Price" value={bookPrice} onChange={(e) => setBookPrice(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleAddBook}>Add Book</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} /> {/* Input for user ID */}
        <input type="number" placeholder="Initial Supply" value={initialSupply} onChange={(e) => setInitialSupply(e.target.value)} /> {/* Input for initial supply */}
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleAddUser}>Add User</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleGetBookInfo}>Get Book Info</button>
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleCheckOut}>Issue Book</button> {/* New button for checkout */}
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleReturnBook}>Return Book</button> {/* New button for returning book */}
      </div>
      <div style={{ marginBottom: '20px' }}>
        {/* <pre>{JSON.stringify(bookInfo, null, 2)}</pre> */}
        <pre style={{color: '#fff'}}><span style={{color: "#cfcccf", fontFamily: 'sans-serif'}}>Book name : </span>{bookInfo[1]}</pre>
        <pre style={{color: '#fff'}}><span style={{color: "#cfcccf", fontFamily: 'sans-serif'}}>Current holder : </span>{bookInfo[2]}</pre>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="User Address" value={userAddr} onChange={(e) => setUserAddr(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleGetUserBorrowedBooks}>Get User Borrowed Books</button>
      </div>
      <div>
        <h2 style={{color: '#adacad'}}>Borrowed Books:</h2>
        <ul style={{color: '#fff'}}>
          {borrowedBooksInfo.map((bookInfo, index) => (
            <li key={index}>{bookInfo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
