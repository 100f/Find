import React, { useEffect } from 'react';
import { SafeAreaView, View, SectionList, TouchableOpacity, Text, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/auth';

import { adjustHorizontalMeasure } from '../../utils/adjustMeasures';
import colors from '../../assets/var/colors';

import styles from './styles';

const ProfileInfo = () => {
    const navigation = useNavigation();

    const { loggedUser } = useAuth();

    const listInfo = [
        {
            title: 'Dados Pessoais',
            data: [
                {
                    titleText: 'Nome',
                    value: loggedUser.data.name
                },
            ]
        },
        {
            title: 'Minha Conta',
            data: [
                {
                    titleText: 'Meu Número',
                    value: loggedUser.data.cell
                },
                {
                    titleText: 'Meu E-mail',
                    value: loggedUser.data.email
                },
            ]
        },
    ]
    
    return (
        <SafeAreaView style={styles.screenContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons 
                        name="arrow-back" 
                        size={adjustHorizontalMeasure(20)} 
                        color={colors.cinzaEscuro}
                    />
                </TouchableOpacity>
                <View style={styles.centeredContainer}>
                    <Text style={styles.headerText}>Meu Perfil</Text>
                </View>
            </View>
            <View style={styles.bodyContainer}>
                <SectionList
                    style={styles.sectionList}
                    sections={listInfo}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Image source={{uri: loggedUser.data.img_url}} style={styles.profilePicture}/>
                            <Text style={styles.customerName}>{loggedUser.data.name}</Text>
                        </View>
                    }
                    renderSectionHeader={({ section: { title } }) => 
                         <Text style={styles.listHeaderTitle}>{title}</Text> 
                    }
                    renderItem={({ item, index }) => 
                        <View style={styles.listItem} key={String(index)}>
                            <Text style={styles.listItemTitle}>{item.titleText}</Text>
                            <Text style={styles.listItemValue}>{item.value}</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

export default ProfileInfo;