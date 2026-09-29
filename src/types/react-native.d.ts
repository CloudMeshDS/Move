declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const TouchableOpacity: any;
  export const TouchableHighlight: any;
  export const TouchableWithoutFeedback: any;
  export const Pressable: any;
  export const ScrollView: any;
  export const FlatList: any;
  export const TextInput: any;
  export const Image: any;
  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
    [key: string]: any;
  };
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select: <T>(specifics: { [platform in 'ios' | 'android' | 'web' | 'default']?: T }) => T;
  };
  export const Dimensions: any;
  export const Animated: any;
  export const Easing: any;
  export const StatusBar: any;
  export const SafeAreaView: any;
  export const ActivityIndicator: any;
  export const Modal: any;
  export const Switch: any;
  export const Alert: {
    alert: (title: string, message?: string, buttons?: any[]) => void;
  };
}
