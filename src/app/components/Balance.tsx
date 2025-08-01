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

  const animateBalance = (start: number,end: number,direction: 'neg' | 'pos') => {

    setTrend(direction) 
    setBalance(start)
    let step:number = 0;

    if (direction === 'pos') {
      step = 30;
    } else {
      step = -30;
    }

    const interval = setInterval(() => {
      console.log('start', start, 'end', end, 'step', step);


      start = start + step;
      if (step > 0) {
        if (start < end) {
          setBalance(start);
        } else {
          setTrend('');
          setBalance(end);
          deleteCookie('balance');
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
          deleteCookie('balance');
          if (end < 0) {
            setTrend('neg');
          }
          clearInterval(interval)
        }
      }

    },100)

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