import React , { useState, useEffect, useMemo}from 'react'
import {io} from 'socket.io-client';
import Chart from './components/Chart';
import TradePanel from './components/TradePanel';
import HoldingsTable from './components/HoldingsTable';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL="https"
const TradingPage = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      TradingPage
    </div>
  )
}

export default TradingPage