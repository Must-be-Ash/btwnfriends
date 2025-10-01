import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';

interface Button3DProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'red' | 'gradient';
  size?: 'default' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button3D({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled = false,
  className,
}: Button3DProps) {
  const isDisabled = disabled || isLoading;

  const getBackgroundColor = () => {
    if (isDisabled) {
      if (variant === 'red') return '#aa6666';
      if (variant === 'gradient') return '#666666';
      return '#666666';
    }
    
    if (variant === 'red') return '#cc3333';
    if (variant === 'gradient') return '#525252';
    return '#444444';
  };

  const sizeStyles = size === 'lg' 
    ? 'px-6 py-3'
    : 'px-4 py-2';

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      className={cn(
        'rounded-lg items-center justify-center',
        sizeStyles,
        isDisabled && 'opacity-60',
        className
      )}
      style={({ pressed }) => ({
        backgroundColor: getBackgroundColor(),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: isDisabled ? 6 : 8 },
        shadowOpacity: isDisabled ? 0.2 : 0.4,
        shadowRadius: isDisabled ? 15 : 25,
        elevation: isDisabled ? 3 : 8,
        transform: pressed && !isDisabled ? [{ scale: 0.96 }] : undefined,
      })}
    >
      <View className="items-center justify-center">
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator color="#ffffff" size="small" />
          </View>
        )}
        <Text
          className={cn(
            'text-white font-medium text-center',
            size === 'lg' ? 'text-base' : 'text-sm'
          )}
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}
