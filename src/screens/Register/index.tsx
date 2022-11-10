import React,{useEffect, useState} from "react";
import { 
  Keyboard, 
  Modal, 
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TrantactionsButtonTypes
 } from "./styles";
 import * as Yup from 'yup';
 import {yupResolver} from '@hookform/resolvers/yup'
 import AsyncStorage from "@react-native-async-storage/async-storage";
 import uuid from 'react-native-uuid';

 import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
 import { useForm } from "react-hook-form";

import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton/Index";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";

export interface FormData {
  [name: string]: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor numerio')
  .positive('nao pode ser negativo')
  .required('Amount é obrigatório')
})



export function Register(){
  const datakey = "@gofinances:transactions";

  const [transactionType,setTransactionType] = useState('');
  const [categoryModalOpen,setCategoryModalOpen] = useState(false);


  const [category,setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState:{errors},
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransctionTypeSelect(type: 'positive'| 'negative'){
    setTransactionType(type);
  }

  function handleOpenModalSelectCategory(){
    setCategoryModalOpen(true)
  }

  function handleCloseModalSelectCategory(){
    setCategoryModalOpen(false)
  }

  async function handleRegister(form:FormData){
    if(!transactionType){
      return Alert.alert('Selecione o tipo de transação');
    }

    if(category.key === 'category'){
      return Alert.alert('Selecione o tipo de transação');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name : form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const data = await AsyncStorage.getItem(datakey);
      const currentData = data ? JSON.parse(data) : [];

      const formattedData = [
        ...currentData,
        newTransaction
      ];

      console.log('**',formattedData)
      await AsyncStorage.setItem(datakey,JSON.stringify(formattedData));

      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });
      reset();

      navigation.navigate("Listagem");

    }catch (error){
      console.log(error);
      Alert.alert('erro');
    }
  }

  // useEffect(()=>{
  //   async function loadData(){
  //     const data = await AsyncStorage.getItem(datakey);
      
     
  //     console.log(JSON.parse(data!));
  //   }

  //   loadData();
  // },[]);

  return(
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Descrição"
              autoCapitalize="sentences"
              autoCorrect={false}
              error = {errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error = {errors.name && errors.amount.message}
            />
            <TrantactionsButtonTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransctionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransctionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TrantactionsButtonTypes>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenModalSelectCategory}
            />
        </Fields>
        <Button
          title="Enviar"
          onPress={handleSubmit(handleRegister)}
        />
        </Form>

        <Modal
          visible={categoryModalOpen}
        >
        <CategorySelect
            category = {category}
            setCategory = {setCategory}
            closeSelectCategory = {handleCloseModalSelectCategory}
        />
        </Modal>
        
      </Container>
    </TouchableWithoutFeedback>
  )
}