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
        'w-full rounded-2xl p-4',
        disabled && 'opacity-50',
        className
      )}
      style={{
        backgroundColor: disabled ? '#3A3A3A' : '#5CB0FF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text className="text-white font-semibold text-lg text-center">
        {children}
      </Text>
    </Pressable>
  );
}
