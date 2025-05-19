import {ethers, parseEther, parseUnits} from 'ethers';
import LibraryContractABI from './LibraryContractABI.json';
import tokenABI from './TokenContractABI.json';

//test 27/4/24
// const provider2 = new ethers.providers.JsonRpcProvider(); // Connect to Ethereum node
const provider = new ethers.BrowserProvider(window.ethereum); // Connect to Ethereum node
const signer = await provider.getSigner();
console.log("signer :", await provider.getSigner());

// const libAddress = "0xB7e2038753547602893c9a4c7C9D5CCE358b93b3";//test hardhat
const libAddress = "0xd68B81Bd5d5920c0Ea247500A98421AD3D7F367A";//test hardhat
const libToken = new ethers.Contract(libAddress, tokenABI, signer);

// const contractAddress = '0x612721395Dcf3A14B5535C3617f89929864E76aB'; // Replace with actual contract address
// const contractAddress = "0x6d92Cf4bD6205cFd7C1309D6EBA65A11D8c49ce7"; //test hardhat
const contractAddress = "0x8aCA6A00e98aEA5aA0559A4D46d9bf1f0B712e5e"; //test hardhat
const contractInstance = new ethers.Contract(contractAddress, LibraryContractABI, signer);
// await contractInstance.wait();

console.log("contract instance : ", contractInstance.target);

export const getBookInfo = async (bookId) => {
  return await contractInstance.getBookInfo(bookId);
};

export const getBookPrice = async (bookId) => {
  const bookPrice = await contractInstance.books(bookId);
  return Number(bookPrice.price);
}

export const addBook = async (title, bookPrice) => {
  const price = parseUnits(bookPrice, 18);
  console.log("method addbook called : ", title);
  console.log("Book price inside : ", price);
  return await contractInstance.addBook(title, price);
};

export const checkOut = async (bookId) => {
  console.log("test : ", bookId);
  const bookprice = await contractInstance.books(bookId);
  console.log("check out book id : ", bookId);
  console.log("book details inside issue book : ", bookprice.price);
  await libToken.approve(contractInstance.target, bookprice.price);
  const transaction = await contractInstance.BookIssue(bookId);
  await transaction.wait(); // Wait for transaction to be mined
};

export const addUser = async (name, userId, initialSupply, mailId) => {
  const initSupply = parseUnits(initialSupply, 18);
  console.log("ini sup : ", name);
  console.log("user id : ", userId);
  console.log("contract addr : ", initSupply);
  console.log("mail id : ", mailId);
  const maxBal = await libToken.balanceOf(signer.address);
  console.log("max bal : ", maxBal);
  await libToken.approve(contractInstance.target, maxBal);
  await contractInstance.addUser(name, userId, initSupply, mailId);
};

export const returnBook = async (bookId) => {
  console.log("return : ",  bookId);
  const bookprice = await contractInstance.books(bookId);
  await libToken.approve(contractInstance.target, bookprice.price);
  const transaction = await contractInstance.returnBook(bookId);
  await transaction.wait(); // Wait for transaction to be mined
};

export const getUserBorrowedBooks = async (userId) => {
  // console.log("borrow book user id : ", userId);
  console.log("return books : ", await contractInstance.getUserBorrowedBooks(userId));
  return await contractInstance.getUserBorrowedBooks(userId);
};

export const getBalance = async (userId) => {
  console.log("decimals : ", await libToken.decimals());
  console.log("user balance : ", await libToken.balanceOf(userId));
  console.log("inside getBalance : ", parseEther("322", "eth"));
  return await libToken.balanceOf(userId);
}

export const transferToken = async (userAddress, transferToAddress, transferAmount) => {
  const amt = parseUnits(transferAmount, 18);
  console.log("amount to transfer : ", amt);
  await libToken.transfer(transferToAddress, amt);
  return true;
}

export const getMailid = async (userAddress) => {
  const mailId = await contractInstance.getMailId(userAddress);
  return mailId;
}

export const blockUser = async (address) => {
  await contractInstance.blockUser(address);
};

export const unblockUser = async (address) => {
  await contractInstance.unBlockUser(address);
};

export const transferBook = async (bookId, toAddress) => {
  await contractInstance.transferBook(bookId, toAddress);
};
