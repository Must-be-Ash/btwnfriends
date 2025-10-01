import { Text, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface TextShimmerProps {
  children: string;
  className?: string;
  duration?: number;
}

export function TextShimmer({
  children,
  className,
  duration = 2000,
}: TextShimmerProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    ).start();
  }, [duration, shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 1, 0.4],
  });

  return (
    <Animated.Text
      className={cn('font-mono text-sm text-gray-400', className)}
      style={{ opacity }}
    >
      {children}
    </Animated.Text>
  );
}

export function TextShimmerBasic({
  children,
  className,
  duration = 1000,
}: {
  children: string;
  className?: string;
  duration?: number;
}) {
  return (
    <TextShimmer className={cn('font-mono text-sm', className)} duration={duration}>
      {children}
    </TextShimmer>
  );
}
