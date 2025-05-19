import React, { useState, useEffect } from 'react';
import { ethers, parseEther, formatEther, formatUnits } from 'ethers';
// import nodemailer from 'nodemailer';
import { addBook, getBookInfo, checkOut, addUser, returnBook, getUserBorrowedBooks, 
  getBalance, transferToken, getBookPrice, getMailid, blockUser, unblockUser, transferBook } from './LibraryContract';
import emailjs from '@emailjs/browser';


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
  const [mailId, setMailId] = useState('');

  //erc20
  const [tokenBalanceAddress, setTokenBalanceAddress] = useState('');
  const [transferToAddress, setTransferToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [bPrice, setBPrice] = useState('');

  const [loading, setLoading] = useState(false);

  const [blockAddress, setBlockAddress] = useState('');
  const [unblockAddress, setUnblockAddress] = useState('');

  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const [bookIdTransfer, setBookIdTransfer] = useState('');
  const [transferBookToAddress, setTransferBookToAddress] = useState('');

  useEffect(() => {
    console.log("use effect ");
    emailjs.init("DjaBDDmfTRcep4wj1");
    document.body.style.backgroundColor = '#0c0942';
  });

  const toggleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  //test 27/4/24
  const connectWallet = async () => {
    try {
      if(window.ethereum){
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
        console.log("connected to account :", accounts[0]);
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
      // console.log("inside add book : ", bookTitle, bookPrice);
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
        const price = await getBookPrice(bookId);
        setBPrice(price / 10 ** 18);
        // console.log("new : ", formatUnits(price, "wei"));
        // console.log("new : ", parseEther(bPrice.toString()));
        console.log("Bprice : ", bPrice);
      }
    } catch (error) {
      alert("Error in fetching the book details,  try again");
      console.error('Error in getting book info', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const checkout = await checkOut(bookId);
      let toMailAddress = await getMailid(userAddress);
      await sendMail(toMailAddress);
      alert("Successfully checked out!...");
    } catch(error) {
      console.log("error checkout :", error);
      alert("Error in checkout, try again...");
    }
  }

  const handleAddUser = async () => {
    try {
      console.log("mail id in handler : ", mailId);
      await addUser(userName, userId, initialSupply, mailId); // Pass user ID and initial supply to addUser function
      setUserName(userName, userId, initialSupply, mailId);
      alert("Successfully added the user : ");
    } catch(error) {
      alert("Error in adding user, try again...");
    }
  }

  const handleReturnBook = async () => {
    try {
      await returnBook(bookId);
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

  //erc20
  const handleGetTokenBalance = async () => {
    try {
      // console.log("test : ", await getBalance(tokenBalanceAddress));
      const bal = await getBalance(tokenBalanceAddress);
      setBalance(formatEther(bal));
      console.log("user balance : ", balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      alert('Error fetching token balance. Please try again.');
    }
  };

  // New function to transfer tokens to another account
  const handleTransferTokens = async () => {
    try {
      // console.log("user address : ", userAddress);
      await transferToken(userAddress, transferToAddress, transferAmount);
      alert(`Successfully transferred ${transferAmount} tokens to ${transferToAddress}`);
    } catch (error) {
      console.error('Error transferring tokens:', error);
      alert('Error transferring tokens. Please try again.');
    }
    
  };

  const handleBlockUser = async () => {
    try {
      await blockUser(blockAddress);
      alert('User successfully blocked');
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Error blocking user. Please try again.');
    }
  };

  const handleUnblockUser = async () => {
    try {
      await unblockUser(unblockAddress);
      alert('User successfully unblocked');
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Error unblocking user. Please try again.');
    }
  };

  const handleTransferBook = async () => {
    try {
      await transferBook(bookIdTransfer, transferBookToAddress);
      alert(`Successfully transferred book ${bookIdTransfer} to ${transferToAddress}`);
    } catch(error) {
      console.error('Error transferring book:', error);
      alert('Error transferring book. Please try again.');
    }
  };

  async function sendMail(toMailAddress){
    console.log("inside send mail");
        const serviceId = "service_lxkhfj8";
        const templateId = "template_hfw93l4";
        try {
          setLoading(true);
          await emailjs.send(serviceId, templateId, {
            from_name: "Library managment",
            to_name: "test to name",
            // to_mail: "krishkarthick2a@gmail.com"
            to_mail: toMailAddress
          });
          alert("email successfully sent check inbox");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
  }

  return (
    <div style={{ backgroundColor: '#0c0942', padding: '20px' }}>
      <header style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: '#94e8ff', textAlign: 'center'}}>Blockchain Based e-Library Management System </h1>
        <div style={{textAlign: 'right'}}>
        <button 
            style={{padding: '10px 20px', backgroundColor: '#ff5733', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }} 
            onClick={toggleAdminMenu}
          >
            {adminMenuOpen ? 'Go to User' : 'Go to Admin'}
          </button>
          {!walletConnected ? (
            <button style={{padding: '10px 20px', backgroundColor: '#6760e6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <b style={{color: '#fff'}}>{userAddress}</b>
          )}
        </div>
      </header>
      {adminMenuOpen && (<><div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Book Title" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
        <input type="number" placeholder="Price" value={bookPrice} onChange={(e) => setBookPrice(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleAddBook}>Add Book</button>
      </div><div style={{ marginBottom: '20px' }}>
          <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} /> {/* Input for user ID */}
          <input type="number" placeholder="Initial Supply" value={initialSupply} onChange={(e) => setInitialSupply(e.target.value)} /> {/* Input for initial supply */}
          <input type="email" placeholder="Mail ID" value={mailId} onChange={(e) => setMailId(e.target.value)} /> {/* Input for mail ID */}
          <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleAddUser}>Add User</button>
        </div>
        <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="User Address to Block" value={blockAddress} onChange={(e) => setBlockAddress(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleBlockUser}>Block User</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="User Address to Unblock" value={unblockAddress} onChange={(e) => setUnblockAddress(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleUnblockUser}>Unblock User</button>
      </div></>)}
      
      {!adminMenuOpen && (<><div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleGetBookInfo}>Get Book Info</button>
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleCheckOut}>Borrow Book</button> {/* New button for checkout */}
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleReturnBook}>Return Book</button> {/* New button for returning book */}
      </div><div style={{ marginBottom: '20px' }}>
          {/* <pre>{JSON.stringify(bookInfo, null, 2)}</pre> */}
          <pre style={{ color: '#fff' }}><span style={{ color: "#cfcccf", fontFamily: 'sans-serif' }}>Book name : </span>{bookInfo[1]}</pre>
          <pre style={{ color: '#fff' }}><span style={{ color: "#cfcccf", fontFamily: 'sans-serif' }}>Current holder : </span>{bookInfo[2]}</pre>
          <pre style={{ color: '#fff' }}><span style={{ color: "#cfcccf", fontFamily: 'sans-serif' }}>Price : </span>{bPrice}</pre>
        </div><div style={{ marginBottom: '20px' }}>
          <input type="text" placeholder="User Address" value={userAddr} onChange={(e) => setUserAddr(e.target.value)} />
          <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleGetUserBorrowedBooks}>Get User Borrowed Books</button>
        </div><div>
          <h2 style={{ color: '#adacad' }}>Borrowed Books:</h2>
          <ul style={{ color: '#fff' }}>
            {borrowedBooksInfo.map((bookInfo, index) => (
              <li key={index}>{bookInfo}</li>
            ))}
          </ul>
        </div><div style={{ marginBottom: '20px' }}>
          <input type="text" placeholder="Token Balance Address" value={tokenBalanceAddress} onChange={(e) => setTokenBalanceAddress(e.target.value)} />
          <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleGetTokenBalance}>Get Token Balance</button>
          <h2 style={{ color: '#adacad' }}>Balance: {Number(balance)}</h2>
        </div><div style={{ marginBottom: '20px' }}>
          <input type="text" placeholder="Transfer To Address" value={transferToAddress} onChange={(e) => setTransferToAddress(e.target.value)} />
          <input type="number" placeholder="Transfer Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
          <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleTransferTokens}>Transfer Tokens</button>
        </div>
        <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Book ID" value={bookIdTransfer} onChange={(e) => setBookIdTransfer(e.target.value)} />
        <input type="text" placeholder="Transfer To Address" value={transferToAddress} onChange={(e) => setTransferBookToAddress(e.target.value)} />
        <button style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleTransferBook}>Transfer Book</button>
        </div>
        </>)}
      
    </div>
  );
}

export default App;
