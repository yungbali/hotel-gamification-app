import React from 'react';
import { Platform, View } from 'react-native';

type MotionLikeComponent = React.ComponentType<any>;

type MotionMap = {
  [key: string]: MotionLikeComponent;
};

const createFallbackComponent = (): MotionLikeComponent => {
  const Component = React.forwardRef<any, any>(({ children, style, ...rest }, ref) => {
    const {
      initial,
      animate,
      exit,
      transition,
      layout,
      whileTap,
      whileHover,
      variants,
      ...viewProps
    } = rest as Record<string, unknown>;

    return (
      <View ref={ref} style={style} {...viewProps}>
        {children}
      </View>
    );
  });

  Component.displayName = 'MotionFallback';
  return Component;
};

let motion: MotionMap;
let AnimatePresence: React.ComponentType<any>;

if (Platform.OS === 'web') {
  // Lazy require so the bundle stays compatible with native
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const framer = require('framer-motion');
  motion = framer.motion;
  AnimatePresence = framer.AnimatePresence;
} else {
  const fallback = createFallbackComponent();
  motion = new Proxy(
    {},
    {
      get: () => fallback,
    }
  ) as MotionMap;
  AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

export { motion, AnimatePresence };
