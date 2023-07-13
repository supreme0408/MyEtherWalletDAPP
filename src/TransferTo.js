import "./App.css";
//react hooks
import { useState } from 'react';
//React-Bootstrap components
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
//web3
const Web3 = require('web3');

export default function TransferTo({ currentAddress, isConnect, contract, accFunc }) {
  const [amt, setAmt] = useState(0);
  const [toAddr, setToAddr] = useState('');
  const [isClicked, setIsClicked] = useState(0);
  const addrVal = (isConnect ? trim(currentAddress) : "Not Connected");

  function trim(addr) {
    if (addr != null) {
      let addr1 = addr.toUpperCase();
      return (addr1.substring(0, 8) + "...." + addr1.substring(37));
    }
  }
  const handleChangeAmt = (e) => {
    setAmt(e.target.value);
  };
  const handleChangeAddr = (e) => {
    setToAddr(e.target.value);
  };
  function showSuccessMessage() {
    alert("SUCCESS");
  }
  function showErrorMessage(text1) {
    alert(text1);
  }

  async function transfer() {
    if (isConnect && contract) {
      if (!isClicked) {
        try {
          setIsClicked(1);
          const amount = Web3.utils.toWei(amt, "ether");
          await contract.methods.transferTo(toAddr, amount).send({ from: currentAddress })
            .on('transactionHash', function (hash) {
              console.log("Confirm transaction with hash ", hash);
            });
          // .on('receipt', function(receipt){

          //     console.log(receipt);
          // });
          accFunc();
          showSuccessMessage();

        } catch (error) {
          showErrorMessage("Error calling transfer ", error);
          console.log("Error calling transfer ", error);
        }
      } else {
        showErrorMessage("Transaction in process");
      }
      setIsClicked(0);
      setAmt(0);
      setToAddr('');
      document.getElementById('amttext').value = "";
      document.getElementById('addrtext').value = "";
    }
  }
  return (
    <>
      <div className="mycomp1-container">
        <div style={{ backgroundColor: "rgba(255, 228, 196, 0.521)", borderRadius: "20px", padding: "12px", marginBottom: "8px", marginRight: "40%", marginLeft: "30%" }}><div style={{ textDecoration: "underline overline", backgroundColor: "black", color: "white", borderRadius: "10px", width: "fit-content", padding: "10px", fontSize: "large", fontWeight: "600" }}>Transfer</div></div>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            From Address
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={addrVal}
            disabled
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            To Address
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            id="addrtext"
            aria-describedby="inputGroup-sizing-default"
            onChange={handleChangeAddr}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Amount
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            inputMode="numeric"
            id="amttext"
            onChange={handleChangeAmt}
          />
          <Button variant="secondary" onClick={transfer}>
          {isClicked? <Spinner animation="border"/>:<>Transfer</>}
          </Button>
        </InputGroup>
      </div>
    </>
  );
}
