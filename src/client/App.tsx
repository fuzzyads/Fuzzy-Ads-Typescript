import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'semantic-ui-react';
import { BrowserRouter, Route } from 'react-router-dom';
import './assets/style/style.css';
import Header from './components/Header';
import SideBar from './components/SideBar';

import Landing from './components/Landing';

import BuyAds from './components/Advertiser/BuyAds';
import PastAds from './components/Advertiser/PastAds';
import AdCreativeForm from './components/Advertiser/AdCreativeForm';
import HowToAdvertiser from './components/Advertiser/HowToAdvertiser';
import CurrentAds from './components/Advertiser/CurrentAds';

import PaymentHistory from './components/Publisher/PaymentHistory';
import HowToPublisher from './components/Publisher/HowToPublisher';

import { useWeb3React } from "@web3-react/core";
import 'bootstrap/dist/css/bootstrap.min.css';


const App = ({injectedConnector}: any) => {
  const path = window.location.pathname;
  const { chainId, activate, account, active, library } = useWeb3React();

  useEffect(() => {
    activate(injectedConnector);
  }, []);

  return (
    <Container>
      <Helmet>
          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Montserrat+Alternates:wght@500;600&display=swap" rel="stylesheet"></link>
          <link rel="stylesheet" href="https://use.typekit.net/gzp4hjm.css"></link>
      </Helmet>

    {active && (
      <BrowserRouter >
        <Header type={path}/>
        

        <div className="fuzzy-data dropshadow" style={{height: '70vh', minWidth: '50%'}}>
          <SideBar type={path}/>

          <Route exact path='/' component={() => <Landing />}/>

          <Route exact path='/advertiser/buy-ads' component={() => <BuyAds />} />
          <Route exact path='/advertiser/current-ads' component={() => <CurrentAds />} />
          <Route exact path='/advertiser/past-ads' component={() => <PastAds />} />
          <Route exact path='/advertiser/how-to' component={() => <HowToAdvertiser />} />
          <Route exact path='/advertiser/ad-creative-form/:id' component={(props: any) => <AdCreativeForm />} />

          <Route exact path='/publisher/payment-history' component={() => <PaymentHistory />} />
          <Route exact path='/publisher/how-to' component={() => <HowToPublisher />} />
        </div>        
      </BrowserRouter>
    )}
    </Container>
  );
}

export default App;
