
import React from "react";
import { View, StyleSheet } from "react-native";

import { AppModelNavProps } from "../../roots/AppModelNav";

type IForgottenPasswordProps = AppModelNavProps<"ForgottenPassword">;
export const ForgottenPassword: React.FC<IForgottenPasswordProps> = ({ navigation }) => {

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