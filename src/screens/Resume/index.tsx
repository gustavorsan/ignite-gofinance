import React, { useCallback, useEffect,useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {  VictoryPie } from "victory-native";
import { useFocusEffect } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths,format } from "date-fns";
import {ptBR} from 'date-fns/locale'

import { HistoryCard } from "../../components/HistoryCard";
import{
  Container, 
  Header, 
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles'

import { TransactionCardProps } from "../../components/TransactionCard";
import { categories } from "../../utils/categories";






interface CategoryData{
  name:string;
  total:number;
  totalFormatted: string;
  color: string;
  percent: string
}


export function Resume(){
  const [isLoading,setIsLoading] = useState(false);
  const [SelectedDate,setSelectedDate] = useState(new Date());
  const [totalByCategories,setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  function handleDateChange(
    action: 'next' | 'previous'
    ){
      let newDate:Date;
      console.log('click')
      if(action ===  'next'){
      newDate = addMonths(SelectedDate,1);      
      }else{
        newDate = subMonths(SelectedDate,1);
      }
      setSelectedDate(newDate!);
  }

  async function loadData() {
    setIsLoading(true);
    const datakey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(datakey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
    .filter((expensive:TransactionCardProps)=> 
      expensive.type === 'negative' &&
      new Date(expensive.date).getMonth() === SelectedDate.getMonth() &&
      new Date(expensive.date).getFullYear() === SelectedDate.getFullYear() 
    );



    const expensivesTotal = expensives
    .reduce((acc:number,item:TransactionCardProps)=>{
        return acc + Number(item.amount);
    },0)

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category =>{
      let categorySum = 0;

      expensives.forEach((expensive:TransactionCardProps) => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.amount)
        }
      });

      if(categorySum>0){
        const totalFormatted = categorySum
        .toLocaleString('pt-BR',{
          style:'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum/expensivesTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          name: category.name,
          totalFormatted,
          total: categorySum,
          color: category.color,
          percent
        })
      }
    })
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }



  useFocusEffect(useCallback(()=>{
    loadData();
  },[SelectedDate]))

  return(

      <Container>      
        {      
        isLoading  ? 
        <LoadContainer>
        <ActivityIndicator 
          color={theme.colors.primary}
          size="large"
        />
        </LoadContainer> :
        <>
          <Header>
            <Title>
              Resumo por Categoria
            </Title>
            </Header>
            <Content
              contentContainerStyle = {{ 
                paddingHorizontal: 24 ,
                paddingBottom: useBottomTabBarHeight()
              }}
              showsHorizontalScrollIndicator={false}
            >
              <MonthSelect>
                  
                    <MonthSelectButton
                      onPress={()=> handleDateChange('previous')}
                    >
                        <MonthSelectIcon name="chevron-left"/>
                      </MonthSelectButton>
                  
                      <Month>{format(SelectedDate,'MMMM, yyyy',{locale: ptBR})}</Month>
                  
                    <MonthSelectButton
                      onPress={()=> handleDateChange('next')}
                    >
                      <MonthSelectIcon name="chevron-right"/>
                    </MonthSelectButton>
                
                </MonthSelect>

              <ChartContainer>
                  <VictoryPie
                    height={280}
                    data={totalByCategories}
                    x="percent"
                    y="total"
                    colorScale={totalByCategories.map(category => category.color)}
                    style={{
                      
                      labels:{
                        fontSize: RFValue(18),
                        fontWeight: 'bold',
                        fill: theme.colors.shape
                      }
                    }}
                    labelRadius={50}
                  />
              </ChartContainer>
              {
                totalByCategories.map(item => (
                  <HistoryCard
                  key={item.name}
                  title=  {item.name}
                  amount= {item.totalFormatted}
                  color= {item.color}
                />
                ))
              }
          </Content>
        </>
        }
      </Container>

  )
}