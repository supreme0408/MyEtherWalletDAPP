//custom style
import "./App.css";
//react hooks
import { useState } from "react";
//React-Bootstrap components
import Nav from 'react-bootstrap/Nav';
import NavLink from "react-bootstrap/NavLink";
import NavItem from "react-bootstrap/NavItem";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
//external js pages
import Welcome from "./Welcome";
//web3
const Web3 = require('web3');

export default function DepositAndWithdraw({currentAddress,isConnect,contract,accFunc}) {
    const [activeKey, setActiveKey] = useState("deposit");
    const addrVal = (isConnect? trim(currentAddress) : "Not Connected");
    const [damount,setDAmount] = useState(0);
    const [wamount,setWAmount] = useState(0);
    const [isClicked,setIsClicked] = useState(0);

    function trim(addr) {
        if (addr != null) {
          let addr1 = addr.toUpperCase();
          return (addr1.substring(0, 8) + "...." + addr1.substring(37));
        }
    }

    const handleSelect = (key) => {
        setActiveKey(key);
    };
    const handleDChange = (e) => {
        setDAmount(e.target.value);
    };
    const handleWChange = (e) => {
        setWAmount(e.target.value);
    };
    function showSuccessMessage() {
        alert("SUCCESS");
    }
    function showErrorMessage(text1) {
        alert(text1);
    }

    async function deposit() {
        if(isConnect && contract){
            if(!isClicked){
            try{
                setIsClicked(1);
                const amount = Web3.utils.toWei(damount,"ether");
                await contract.methods.deposit().send({from: currentAddress,value: amount})
                    .on('transactionHash', function(hash){
                        console.log("Confirm transaction with hash ",hash);
                    });
                    // .on('receipt', function(receipt){
                    //     //const data = receipt.events.DW();
                    //     console.log(receipt);
                        
                    // });
                accFunc();
                showSuccessMessage();
            } catch(error){
                showErrorMessage("Error calling deposit")
                console.log("Error calling deposit",error);
            }
        } else{
            showErrorMessage("Transaction in process");
        }
            setDAmount(0);
            document.getElementById("wtext").value = "";
            setIsClicked(0);
        } 
    }

    async function withdraw() {
        if(isConnect && contract){
            if(!isClicked){
            try{
                setIsClicked(1);
                const amount = Web3.utils.toWei(wamount,"ether");
                await contract.methods.withdraw(amount).send({from: currentAddress})
                    .on('transactionHash', function(hash){
                        console.log("Confirm transaction with hash ",hash);
                    });
                    // .on('receipt', function(receipt){
                    //     console.log(receipt);
                        
                    // });
                accFunc();
                showSuccessMessage();
            } catch(error){
                showErrorMessage("Error calling withdraw");
                console.log("Error calling withdraw",error);
            }
        } else{
            showErrorMessage("Transaction in process");
        }
            setIsClicked(0);
            setWAmount(0);
            document.getElementById("dtext").value = "";
        } 
    }

    const renderPage = (key) => {
        switch (key) {
            case "deposit":
                return (
                    <>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">
                                Address
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
                                Amount
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                inputMode="numeric"
                                id="wtext"
                                onChange={handleDChange}
                            />
                            <Button variant="secondary" onClick={deposit}>
                                {isClicked? <Spinner animation="border"/>:<>Deposit</>}
                            </Button>
                        </InputGroup>
                    </>
                );
            case "withdraw":
                return (
                    <>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">
                                Address
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
                                Amount
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                id="dtext"
                                onChange={handleWChange}
                                inputMode="numeric"
                            />
                            <Button variant="secondary" id="button-addon1" onClick={withdraw}>
                            {isClicked? <Spinner animation="border"/>:<>Withdraw</>}
                            </Button>
                        </InputGroup>
                    </>
                );
            default:
                return <Welcome />
        }
    }

    return (
        <div className="mycomp1-container">
            <div className="mycomp-itm1">
                <Nav variant="pills" activeKey={activeKey} onSelect={handleSelect} style={{ display: "flex", justifyContent: "space-around" }}>
                    <NavItem>
                        <NavLink eventKey="deposit" className={`mynav-link ${activeKey === "deposit" ? "active" : ""}`}>Deposit</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="withdraw" className={`mynav-link ${activeKey === "withdraw" ? "active" : ""}`}>Withdraw </NavLink>
                    </NavItem>
                </Nav>
            </div>
            <div className="mycomp-itm2">
                {renderPage(activeKey)}
            </div>
            <div>
                
            </div>
        </div>
    );
}