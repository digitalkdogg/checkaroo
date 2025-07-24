'use client';

import { useState, useEffect } from 'react';
import { superEcnrypt } from '@/common/crypt';
import Loading from '@/app/components/Loading';
import {readCookie, deleteCookie } from '@/common/cookieServer';
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

  useEffect(() => {
    if (!session) return;

    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: superEcnrypt(session) }),
        });

        const json: BalanceResponse[] = await response.json();

        if (response.ok && Array.isArray(json) && json.length > 0) {
          animateBalance(json[0].balance)
        } else {
          setBalance(0);
        }
      } catch {

        setBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    const getCookieBalance = async (bal:number): Promise<number> => {
      const cookieBalance = await readCookie('balance');
      if (cookieBalance) {
        const parsed = parseFloat(cookieBalance);
        return isNaN(parsed) ? 0 : parsed;
      } else {
        return bal;
      }
    };

    const animateBalance = async (endBalance: number) => {
        let newBalance = await getCookieBalance(endBalance); 
        setBalance(newBalance);

        const balinterval = setInterval(() => {
            if ((newBalance + 100) < endBalance) {
                newBalance += 100;
                setBalance(newBalance);
            } else {
                setBalance(endBalance);
                clearInterval(balinterval);
                deleteCookie('balance')
            }
        }, 100);
    };

    fetchBalance();
  }, [session]);

  if (!enable) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.circle}>
        {isLoading ? (
          <span className="relative size-30 left-3 top-3">
            <Loading />
          </span>
        ) : (
          <>
            <div className={styles.label}>Balance</div>
            <div className={styles.number}>
              <span>${(balance ?? 0).toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}