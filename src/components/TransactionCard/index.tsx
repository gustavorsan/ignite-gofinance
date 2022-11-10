import React from "react";
import { categories } from "../../utils/categories";

import { 
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date
 } from "./styles";



 export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string
 }

  interface Props {
  data:TransactionCardProps
}

export function TransactionCard({data}:Props){

  const [category] = categories.filter(
    item => item.key === data.category
  );
  const {name,amount,date,type} = data

  return(
    <Container>
      <Title>
        {name}
      </Title>
      <Amount type={type}>
        {type === 'negative' && '-'}
        {amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={category.icon}/>
          <CategoryName>
            {category.name}
          </CategoryName>
        </Category>
        <Date>
          {date}
        </Date>
      </Footer>

    </Container>
  )
}