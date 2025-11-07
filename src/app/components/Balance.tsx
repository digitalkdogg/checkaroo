'use client';

import { useState, useEffect } from 'react';
import { superEcnrypt } from '@/common/crypt';
import Loading from '@/app/components/Loading';
import { readCookie, deleteCookie } from '@/common/cookieServer';
import styles from '@/resources/balance.module.css';

interface Props {
  enable?: boolean;
  session: string;
}

interface BalanceResponse {
  balance: number;
}

export default function Page({ enable = true, session }: Props) {
  const [balance, setBalance] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [trend, setTrend] = useState<'neg' | 'pos' | ''>('');

  const fetchBalance = async (oldBalance?: number) => {
    try {
      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: superEcnrypt(session) }),
      });

      const json: BalanceResponse[] = await response.json();

      if (response.ok && json.length > 0) {
        const newBalance = Number(json[0].balance).toFixed(2);

        if (typeof oldBalance === 'number') {
            if (oldBalance < Number(newBalance)) {
                animateBalance(oldBalance, Number(newBalance), 'pos');
            } else {
                animateBalance(oldBalance, Number(newBalance), 'neg');
            }
        } else {
          if (Number(newBalance) < 0) {
            setTrend('neg');
          }
          setBalance(Number(newBalance));
        }
      } else {
        setBalance(0);
      }
    } catch {
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getBalance = async () => {
    const cookieBalance = await readCookie('balance');
    fetchBalance(cookieBalance ? Number(cookieBalance) : undefined);
  };

  const calcStep = (start: number,end: number) => {
    const diff = Math.abs(end - start);
    if (diff <= 10) return 1;
    if (diff <= 100) return 20;
    if (diff <= 300) return 35;
    if (diff <= 500) return 50;
    if (diff <= 750) return 75;
    if (diff <= 1000) return 100;
    if (diff <= 3000) return 500;
    if (diff <= 5000) return 700;
    return 30;
  }

  const calcTiming = (start: number, end:number) => {
    const diff = Math.abs(end - start);
    if (diff <= 500) return 600;
    if (diff <= 1000) return 400;
    if (diff <= 1500) return 300;
    return 100;
  }

  const animateBalance = (start: number,end: number,direction: 'neg' | 'pos') => {

    setTrend(direction) 
    setBalance(start)
    let step:number = calcStep(start, end);
    let timing:number = calcTiming(start, end);

    console.log(timing);

    if (direction === 'pos') {
      step = step;
    } else {
      step = -step;
    }

    const interval = setInterval(() => {
      
      start = start + step;
      if (step > 0) {
        if (start < end) {
          setBalance(start);
        } else {
          setTrend('');
          setBalance(end);
          if (end < 0) {
            setTrend('neg');
          }
          clearInterval(interval)
        }
      } else {
        if (start > end ) {
          setBalance(start);
        } else {
          setTrend('')
          setBalance(end);
          if (end < 0) {
            setTrend('neg');
          }
          clearInterval(interval)
        }
      }
      deleteCookie('balance');
    },timing)

  }

  useEffect(() => {
    if (session) {
      getBalance();
    }
  }, [session]);

  if (!enable) return null;

  return (
    <div id="balance" className={`${styles.wrap} ${trend}`}>
      <div
        className={`${styles.circle} ${
          trend === 'neg' ? styles.neg : trend === 'pos' ? styles.pos : ''
        }`}
      >
        {isLoading ? (
          <span className="relative size-30 left-3 top-3">
            <Loading />
          </span>
        ) : (
          <>
            <div className={styles.label}>Balance</div>
            <div className={styles.number}>
              <span className="min-h-[34px]">
                {typeof balance === 'number' && <span>${balance.toFixed(2)}</span>}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}