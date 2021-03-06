import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Picker, Keyboard, Alert, Image, ActivityIndicator, Modal } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import Constants from 'expo-constants';

import { useAuth } from '../../contexts/auth';

import api from '../../services/api';
import adjustFontSize from '../../utils/adjustFontSize';

import colors from '../../assets/var/colors';
import styles from './styles';

import RoundedButton from '../../components/RoundedButton';
import UnderlinedTextButton from '../../components/UnderlinedTextButton';
import LoadingIndicator from '../../components/LoadingIndicator';


const ItemManagement = ({ onItemCreation, onOrderPress, itemId = null, onItemEdited }) => { 
    const [selectedTimeRange, setSelectedTimeRange] = useState (0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState({ uri: null, base64: null });
    const [loading, setLoading] = useState(false);
    
    
    const { loggedUser } = useAuth();
    
    useEffect(() => {
        if(!!itemId){
            loadItemDataToEdit();
        }
    }, [itemId]);

    const loadItemDataToEdit = async () => {
        try{
            const response = await api.get(`${loggedUser.data.type === 'service' ? '/company/services' : '/company/products'}/${itemId}`);
            if(response.status !== 200 || response === undefined){
                Alert.alert('Erro', `${loggedUser.data.type === 'service' ? 'Serviço' : 'Produto'} inválido!`);
            }
            else{
                const item = response.data[0];
                
                setImage({uri: item.img_url});
                setPrice(item.price);
                setName(item.name);
                setDescription(item.description);

                if(item.limit_time){
                    const availableTimeRanges = timeRanges;
                    const [selectedTimeRange] = availableTimeRanges.filter((timeRange) => timeRange.range === item.limit_time);
                    setSelectedTimeRange(selectedTimeRange.id);
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const imagePickerConditions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: false,
        quality: 1,
    }
    const timeRanges = [
        { id: 0, range: '5min - 10min' },
        { id: 1, range: '10min - 15min' },
        { id: 2, range: '15min - 20min' },
        { id: 3, range: '20min - 25min' },
    ];


    const getName = (typed) => setName(typed);
    const getDescription = (typed) => setDescription(typed);
    const getPrice = (typed) => setPrice(typed);

    const checkSpecialCharacters = /[-'`~!@#$%^&*()_|+=?;:'"<>\{\}\[\]\\\/]/gi;
    const checkLetters = /[a-zA-Z]/g;

    const getPermissionsAsync = async () => {
        if(Constants.platform.ios){
            const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);

            if(status !== 'granted'){
                alert('Não podemos prosseguir, precisamos de permissões para utilizar Camera Roll.');
                return;
            }
        }
    };
    const getImage = async () => {
        getPermissionsAsync();
        try{
           let result = await ImagePicker.launchImageLibraryAsync(imagePickerConditions);
           if(!result.cancelled && result.uri){
               setImage(result);
           } 
        }
        catch(error){
            console.log(error);
        }
    }
    const handleSellingItemCreation = async () => {
        if(name === '' || description === '' || price === '0' || price === '') {
            return Alert.alert('Error', 'Preencha todos os campos marcados com "*"!');
        }
        else {
            if(checkSpecialCharacters.test(name) || checkSpecialCharacters.test(description)) 
                return loggedUser.data.type === 'product'  
                    ? Alert.alert('Error', '"Nome do produto" e "Descrição do produto" não podem conter caracters especiais!')
                    : Alert.alert('Error', '"Nome do serviço" e "Descrição do serviço" não podem conter caracters especiais!');
            else {
                if(checkSpecialCharacters.test(price) || checkLetters.test(price)) 
                    return Alert.alert('Error', 'Preço Fixo" só deve conter números e ponto!');
                else {
                    
                    setLoading(true);
                    const response = await finishItemRegistration();
                    setLoading(false);
                    
                    if(response === undefined || response.status !== 201){
                        Alert.alert('Error', `Falha na criação do ${loggedUser.data.type === 'product' ? 'produto' : 'serviço'}!`);
                    }
                    else{
                        Alert.alert(
                            'Concluído', 
                            `${loggedUser.data.type === 'product' ? 'Produto' : 'Serviço'} criado com sucesso!`,
                            [{ text: 'OK', onPress: () => onItemCreation() }]
                        );
                    }
                }
            }
        }    
    };

    const finishItemRegistration = async () => {
        const itemPrice = parseFloat(price)
        
        const id = loggedUser.data.id;

        const requestConfiguration = {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        } 

        let picToUpload = null;

        if(image.uri !== null){
            const imageExtension = image.uri?.split('.').pop();
            const imageName = image.uri.split('/').pop();
            
            if(imageExtension !== 'jpg' && imageExtension !== 'png'){
                return;
            } 
            picToUpload = {
                uri: image.uri,
                name: imageName,
                type: `image/${imageExtension === 'jpg' ? 'jpeg' : 'png'}`,
            }
        } 
       
        const itemData = new FormData();
        
        itemData.append('name', name);
        itemData.append('id_company', id)
        itemData.append('description', description);
        itemData.append('price', itemPrice);
        itemData.append('limit_time', timeRanges[selectedTimeRange].range);
        itemData.append('img_url', picToUpload);

        
        try{
            const response = !!itemId
                ? await api.put(`${loggedUser.data.type === 'product' ? '/my-products' : '/my-services'}/${itemId}`, itemData, requestConfiguration)
                : await api.post(`${loggedUser.data.type === 'product' ? '/my-products' : '/my-services'}`, itemData, requestConfiguration); 
            
            return response;
        }
        catch(error){
            console.log(error)
        }
        
    };

    const handleItemEdition = async () => {
        if(name === '' || description === '' || price === '0' || price === '') {
            return Alert.alert('Error', 'Preencha todos os campos marcados com "*"!');
        }
        else {
            if(checkSpecialCharacters.test(name) || checkSpecialCharacters.test(description)) 
                return loggedUser.data.type === 'product'  
                    ? Alert.alert('Error', '"Nome do produto" e "Descrição do produto" não podem conter caracters especiais!')
                    : Alert.alert('Error', '"Nome do serviço" e "Descrição do serviço" não podem conter caracters especiais!');
            else {
                if(checkSpecialCharacters.test(price) || checkLetters.test(price)) 
                    return Alert.alert('Error', 'Preço Fixo" só deve conter números e ponto!');
                else {
                    
                    setLoading(true);
                    const response = await finishItemRegistration();
                    setLoading(false);

                    if(response === undefined || response.status !== 200){
                        Alert.alert('Error', `Falha ao modificar o ${loggedUser.data.type === 'product' ? 'produto' : 'serviço'}!`);
                    }
                    else{
                        Alert.alert(
                            'Concluído', 
                            `${loggedUser.data.type === 'product' ? 'Produto' : 'Serviço'} editado com sucesso!`,
                            [{ text: 'OK', onPress: () => onItemEdited() }]
                        );
                    }
                }
            }
        }    
    };


    return (
        <SafeAreaView style={styles.screenContainer}>
            <LoadingIndicator active={loading}/>
            <View style={styles.headerContainer}>
                <UnderlinedTextButton 
                    selected={false} 
                    fontSize={adjustFontSize(15)} 
                    style={styles.headerButton}
                    onPress={() => onOrderPress()}
                >
                    Pedidos
                </UnderlinedTextButton>
                <UnderlinedTextButton 
                    selected={true} 
                    fontSize={adjustFontSize(15)} 
                    style={styles.headerButton}
                    onPress={() => {}}
                >
                    {`Meus ${loggedUser.data.type === 'product' ? 'Produtos' : 'Serviços'}`}
                </UnderlinedTextButton>
            </View>
            <TouchableWithoutFeedback style={styles.bodyContainer} onPress={() => Keyboard.dismiss()}>
                <ScrollView style={{width: '100%', height: '100%'}} contentContainerStyle={styles.myProductsContainer}>
                    <View style={styles.topicContainer}>
                        <Text style={styles.topicTitleText}>{`Nome do ${loggedUser.data.type === 'product' ? 'Produto' : 'Serviço'} *`}</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder={`Digite o nome do ${loggedUser.data.type === 'product' ? 'produto' : 'serviço'}`} 
                            placeholderTextColor={colors.cinza}
                            onChangeText={getName}
                            value={name}
                        />
                    </View>
                    <View style={styles.topicContainer}>
                        <Text style={styles.topicTitleText}>{`Descrição do ${loggedUser.data.type === 'product' ? 'Produto' : 'Serviço'} *`}</Text>
                        <TextInput style={styles.multilineInput} 
                            placeholder="Digite uma descrição"
                            placeholderTextColor={colors.cinza}
                            multiline={true}
                            onChangeText={getDescription}
                            value={description}
                        />
                    </View>
                    <View style={styles.topicContainer}>
                        <Text style={styles.topicTitleText}>Tempo médio de conclusão</Text>
                        <Picker 
                            style={styles.picker}
                            selectedValue={selectedTimeRange}
                            onValueChange={(value) => setSelectedTimeRange(value)}
                            itemStyle={styles.pickerItem}
                            mode="dropdown"
                        >
                            {
                                timeRanges.map((timeRange, index) => {
                                    return <Picker.Item 
                                                label={timeRange.range} 
                                                value={timeRange.id} 
                                                key={index}
                                            />
                                    })
                            }
                        </Picker>
                        
                    </View>
                    <View style={styles.topicContainer}>
                        <Text style={styles.topicTitleText}>Preço Fixo *</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Digite um valor" 
                            placeholderTextColor={colors.cinza}
                            onChangeText={getPrice}
                            value={price}
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={styles.topicContainer}>
                        <Text style={styles.topicTitleText}>Adicione uma imagem</Text>
                        {
                            image.uri
                            ?
                                <TouchableOpacity style={styles.image} onPress={getImage}>
                                    <Image source={{uri: image.uri}} style={styles.image}/>
                                </TouchableOpacity>
                                
                            :
                                <TouchableOpacity style={styles.imageToChoose} onPress={getImage}>
                                    <View style={styles.verticalView}/>
                                    <View style={styles.horizontalView}/>
                                </TouchableOpacity>
                        }    
                    </View>
                    <RoundedButton
                        text={!!itemId ? "Editar" : "Concluir"}
                        selected={true}
                        width={256}
                        height={50}
                        fontSize={adjustFontSize(16)}
                        style={styles.doneButton}
                        onPress={!!itemId ? () => handleItemEdition() : () => handleSellingItemCreation()}
                    />
                </ScrollView>    
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

export default ItemManagement;