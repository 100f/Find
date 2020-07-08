import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import { 
        useFonts, 
        Montserrat_500Medium, Montserrat_600SemiBold, 
        Montserrat_700Bold, 
        Montserrat_400Regular
} from '@expo-google-fonts/montserrat';

import { AuthProvider } from './src/contexts/auth';
import { CartProvider } from './src/contexts/cart';

import Routes from './src/routes';

import Home from './src/pages/Home';
import CompanyProducts from './src/pages/CompanyProducts';
import Companies from './src/pages/Companies'
import DeliveryOptions from './src/pages/DeliveryOptions'
import SuccessOrder from './src/pages/SuccessOrder';
import Login from './src/pages/Login';
import CustomerRegistration from './src/pages/CustomerRegistration';
import PaymentOptions from './src/pages/PaymentOptions';
import ProductDetails from './src/pages/ProductDetails';
import OpeningHours from './src/pages/OpeningHours';
import RedeemProduct from './src/pages/RedeemProduct';
import DeliveryAddress from './src/pages/DeliveryAddress';
import RegistrationType from './src/pages/RegistrationType';
import RequestsMade from './src/pages/RequestsMade';
import CompanyPersonalData from './src/pages/CompanyPersonalData';
import CompanyRegistration from './src/pages/CompanyRegistration';
import HomeCompany from './src/pages/HomeCompany';
import CompanyRunning from './src/pages/CompanyRunning';
import CompanySellingItems from './src/pages/CompanySellingItems';
import ServiceScheduling from './src/pages/ServiceScheduling';
//import MarketBag from './src/pages/MarketBag';

import OrderDetails from './src/pages/OrderDetails';
import ServiceOptions from './src/pages/ServiceOptions';

export default function App() {

  const [fontsLoaded] = useFonts ({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })
  if(!fontsLoaded) {
    return <AppLoading />
  }
  else {
    return (
      
      <NavigationContainer>
        <CartProvider>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </CartProvider>
      </NavigationContainer>
       
      // <CompanyProducts/>
      // <Companies />
      // <Home />
      // <Login />
      // <DeliveryOptions/>
      // <SuccessOrder />
      // <CustomerRegistration/>
      // <PaymentOptions />
      // <ProductDetails />
      // <OpeningHours/>
      // <RedeemProduct/>
      // <DeliveryAddress/>
      // <RegistrationType />
      // <RequestsMade/>
      // <RegistrationType />
      // <CompanyRegistrationType />
      // <CompanyPersonalData />
      // <CompanyRegistration />
      // <HomeCompany />
      //<CompanySellingItems/>
      //<ServiceScheduling/>
      // <ServiceOptions />
      // <OrderDetails />
      // <MarketBag />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
