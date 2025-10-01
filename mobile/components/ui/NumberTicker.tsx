import { Text, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  className?: string;
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = 'up',
  className,
  delay = 0,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const animatedValue = useRef(new Animated.Value(direction === 'down' ? value : 0)).current;
  const [displayValue, setDisplayValue] = useState(direction === 'down' ? value : 0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: direction === 'down' ? 0 : value,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, direction, delay, animatedValue]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value: val }) => {
      setDisplayValue(Number(val.toFixed(decimalPlaces)));
    });

    return () => animatedValue.removeListener(listener);
  }, [animatedValue, decimalPlaces]);

  const formattedValue = Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(displayValue);

  return (
    <Text className={cn('text-black tabular-nums tracking-wider', className)}>
      {formattedValue}
    </Text>
  );
}
