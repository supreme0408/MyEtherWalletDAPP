import './App.css';

export default function Welcome() {

  const isMobile = window.innerWidth <= 768;
  const pStyle = {
    marginLeft:"12%",
  };

  const pStyleMobile = {
    marginLeft:"30%",
  };
    return (
      <div className="welcome-container">
        <p style={{marginLeft:"5%"}}>Welcome</p>
        <p style={isMobile?pStyleMobile:pStyle}>To</p>
        <p><span style={{color:"white"}}>Ether</span><span> Wallet</span></p>
      </div>
    );
  }
  