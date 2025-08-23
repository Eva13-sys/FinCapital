import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';


import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

//reusable components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

//public pages
import HomePage from './pages/landing/home/HomePage';
import SignUpPage from "./pages/landing/signup/SignUpPage";
import LoginPage from "./pages/landing/login/LoginPage";
import ResetPasswordPage from './pages/landing/reset/ResetPasswordPage';



//private pages
import Dashboard from "./pages/dashboard/Dashboard";
import TradingPage from "./pages/trading/TradingPage";
import CommunityPage from "./pages/community/CommunityPage";
import LearnPage from "./pages/learn/LearnPage";
import MentorPage from "./pages/mentor/MentorPage";
import PlannerPage from "./pages/planner/PlannerPage";
import ESGPage from "./pages/esg/ESGPage";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <BrowserRouter>
            <div className='flex flex-col min-h-screen'>
                <Navbar />
                <div className='flex-1'>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />


                        <Route path="/dashboard" element={
                            <PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/trading" element={
                            <PrivateRoute><TradingPage /></PrivateRoute>
                        } />
                        <Route path="/community" element={
                            <PrivateRoute><CommunityPage /></PrivateRoute>
                        } />
                        <Route path="/learn" element={
                            <PrivateRoute><LearnPage /></PrivateRoute>
                        } />
                        <Route path="/learn/stock"
                        <Route path="/mentor" element={
                            <PrivateRoute><MentorPage /></PrivateRoute>
                        } />
                        <Route path="/planner" element={
                            <PrivateRoute><PlannerPage /></PrivateRoute>
                        } />
                        <Route path="/esg" element={
                            <PrivateRoute><ESGPage /></PrivateRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </div>

        </BrowserRouter>
    </AuthProvider>

);
