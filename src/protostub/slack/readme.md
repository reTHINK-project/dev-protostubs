## Slack Protostub

### Slack Channels creation

 A Hyperty de Group Chat cria um Group Chat e convida alguém duma equipa do slack para se juntar. Nesse caso, do lado do slack vai aparecer um novo canal, publico ou privado, e o protostub slack é observer do data object associado.

![slack channel creation](create-slack-channel.png)

### Discover Slack Channels and Subscribe them

A Hyperty do Group Chat descobre quais os canais existentes duma equipa slack e subscreve-os. Nesse caso o protostub slack recebe os pedidos de discovery dos objectos de comunicação q os mapeia nos pedidos de API para listar os canais existentes. Depois a Hyperty pede para os subscrever e torna-se um observer de cada um dos canais subscritos. Do lado do protostub é feito o pedido para o utilizador se juntar a esse canal.

### Direct Messages

Mensagens directas entre utilizadores é uma variante do anterior, onde existe um grupo por cada utilizador com quem se trocam mensagens directas, sendo a hyperty observer desse grupo e o protostub um reporter
