import { Pressable, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface SendButton3DProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SendButton3D({ 
  children, 
  onPress, 
  disabled = false, 
  className 
}: SendButton3DProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={cn(
        'w-full py-4 px-6 rounded-xl relative overflow-hidden',
        disabled && 'opacity-50',
        className
      )}
      style={({ pressed }) => ({
        backgroundColor: disabled ? '#1f1f1f' : '#2a2a2a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: disabled ? 4 : 8 },
        shadowOpacity: disabled ? 0.2 : 0.4,
        shadowRadius: disabled ? 12 : 24,
        elevation: disabled ? 2 : 8,
        transform: pressed && !disabled ? [{ translateY: 1 }] : undefined,
      })}
    >
      <Text className="text-white font-semibold text-lg text-center relative z-10">
        {children}
      </Text>
    </Pressable>
  );
}
