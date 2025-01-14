import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import axios from 'axios'

const provider = new ethers.providers.Web3Provider(window.ethereum);
const serverEndpoint = 'http://localhost:3001'

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();


    async function getContracts() {
      const response = await axios.get(`${serverEndpoint}/contracts`)

      console.log(response);

      setEscrows(response.data.contracts || [])
    }

    getContracts()
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const wei = ethers.utils.parseUnits(document.getElementById('ether').value, "ether")
    const value = ethers.BigNumber.from(`${wei}`);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);


    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    axios.post(`${serverEndpoint}/contract`, escrow)
      .then(response => setEscrows([...escrows, escrow]))
  }

  return (
    <>
      <div className="header">
        Escrow Transactions Form
      </div>

      <div className="container">


        <div className="contract">
          <h1> New Contract </h1>
          <label>
            Arbiter Address
            <input type="text" id="arbiter" />
          </label>

          <label>
            Beneficiary Address
            <input type="text" id="beneficiary" />
          </label>

          <label>
            Deposit Amount (in Ether)
            <input type="text" id="ether" />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
          >
            Deploy
          </div>
        </div>

        <div className="existing-contracts">
          <h1> Existing Contracts </h1>

          <div id="container">
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
