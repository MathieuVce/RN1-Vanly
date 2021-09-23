
import React from "react";
import { View, StyleSheet } from "react-native";

import { AppModelNavProps } from "../../roots/AppModelNav";

type IRegisterProps = AppModelNavProps<"Register">;
export const Register: React.FC<IRegisterProps> = ({ navigation }) => {

    return (
        <View style={styles.container}>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});