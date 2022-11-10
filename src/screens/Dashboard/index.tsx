import React,{useCallback, useEffect, useState} from "react";
import { ActivityIndicator } from "react-native";
import { 
  Container, 
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";

import { useFocusEffect } from "@react-navigation/native";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard,TransactionCardProps } from "../../components/TransactionCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export interface DataListProps extends TransactionCardProps{
  id: string;
}
interface HighlightProps{
  amount: string;
  lastTransaction : string
}

interface HighlightData {
  entries: HighlightProps;
  expensives : HighlightProps;
  total:HighlightProps;
}

export function Dashboard(){
  const datakey = "@gofinances:transactions";

  const theme = useTheme();

  const [isLoading,setIsLoading] = useState(true)
  const [transactions,setTransactions] = useState<DataListProps[]>([]);
  const [highlightData,setHighlightData] = useState<HighlightData>({} as HighlightData);

  function getLastTransactionDate(
    transaction:DataListProps[],
    type: 'positive'|'negative'
    ){
      const lastTransactions = transactions 
      .filter((trans : DataListProps) => trans.type = type)
      .map((trans : DataListProps) => new Date(trans.date).getTime());

      const lastDate = new Date(Math.max.apply(Math,lastTransactions));

      return `${lastDate.getDate()} de ${lastDate.toLocaleString('pt-Br',{month: 'long'})}`

  }

  async function loadTransactions(){
    const response = await AsyncStorage.getItem(datakey);
    const transactions = response ? JSON.parse(response) : [];


    let entriesTotal = 0;
    let expensiveTotal = 0;
    
    const transactionsFormatted:DataListProps[] = transactions
    .map((item:DataListProps)=>{

      if(item.type === 'positive'){
        entriesTotal += Number(item.amount);
      }else{
        expensiveTotal += Number(item.amount);
      }




      const amount = Number(item.amount)
      .toLocaleString('pt-BR',{
       style: "currency",
       currency: "BRL"
      })

      
      const date = Intl.DateTimeFormat('pt-BR',{
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return{
        id: item.id,
        name: item.name,
        amount,
        date,
        type : item.type,
        category: item.category
      }
    });


    setTransactions(transactionsFormatted);




  
 



    const lastExpenseDateFormatted =  getLastTransactionDate(transactions,'negative');

    const lastEntriesDateFormatted =  getLastTransactionDate(transactions,'positive');

    const totalInterval = `01 a ${lastExpenseDateFormatted}`



    const total = entriesTotal - expensiveTotal;
    setIsLoading(true);
    setHighlightData({
      entries:{
        amount:  entriesTotal.toLocaleString('pt-BR',{
          style:'currency',
          currency: 'BRL'
         }) ,
        lastTransaction: `Ultima entrada dia ${lastEntriesDateFormatted}` 
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR',{
          style:'currency',
          currency: 'BRL'
         }),
         lastTransaction: `Ultima saída dia ${lastExpenseDateFormatted}` 
      },
      total :{
        amount: total.toLocaleString('pt-BR',{
          style:'currency',
          currency: 'BRL'
         }),
         lastTransaction:  totalInterval
      }
    });

   setIsLoading(false);
  }


  useEffect(()=>{
    loadTransactions();
  },[])

  useFocusEffect(useCallback(()=>{
    loadTransactions();

  },[]))

  function handleLogout(){
    console.log('click')
  }
  return(
  <GestureHandlerRootView
    style={{flex: 1}}
  >
    <Container>
      {
        isLoading ? 
          <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size="large"
          />
          </LoadContainer> :
        <>
        <Header>
          <UserWrapper>
          <UserInfo>
            <Photo source={{uri: 'data:image/jpeg;base64,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'}}/>
            <User>
              <UserGreeting>Olá</UserGreeting>
              <UserName>Gustavo</UserName>
            </User>
          </UserInfo>  
          {/**@ts-ignore*/}
          <LogoutButton
            onPress={handleLogout}
          >
            <Icon name='power'/>
          </LogoutButton>  

          </UserWrapper>
        </Header>
        <HighlightCards>
          <HighlightCard 
            type="up"
            title="Entradas"
            amount={highlightData?.entries?.amount}
            lastTrasaction={highlightData?.entries?.lastTransaction}
          />
          <HighlightCard 
            type="down"
            title="Saídas"
            amount={highlightData?.expensives?.amount}
            lastTrasaction={highlightData?.expensives?.lastTransaction}
          />
          <HighlightCard 
            type="total"
            title="Total"
            amount={highlightData?.expensives?.amount}
            lastTrasaction={highlightData?.total?.lastTransaction}
          />

        </HighlightCards>
        <Transactions>
          <Title>Listagem</Title>
          <TransactionsList
            data={transactions}
            keyExtractor= { item => item.id}
            renderItem={({item}:any)=> <TransactionCard data={item}/>}
          />
        </Transactions>
      </>  
      }
    </Container>
   </GestureHandlerRootView>
      
  )
}

