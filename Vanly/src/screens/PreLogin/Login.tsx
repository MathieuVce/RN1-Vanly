
import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, SafeAreaView, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { AppModelNavProps } from "../../roots/AppModelNav";

type ILoginProps = AppModelNavProps<"Login">;
export const Login: React.FC<ILoginProps> = ({  }) => {
    return (
        <SafeAreaView style={styles.container}>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});