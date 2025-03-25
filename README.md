# Comanda Digital - Ionic + Angular Standalone

Este projeto consiste em uma **Comanda Digital** desenvolvida com **Ionic** e **Angular Standalone**, permitindo que usuários façam pedidos de forma digital e acompanhem o consumo.

## Tecnologias Utilizadas

- **Ionic** (Framework para aplicações híbridas)
- **Angular Standalone** (Nova abordagem sem módulos)
- **Capacitor** (Para builds em Android e iOS)
- **TypeScript**
- **HTML e SCSS**

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** (versão recomendada: 18 ou superior)
- **NPM** ou **Yarn**
- **Ionic CLI**
  ```sh
  npm install -g @ionic/cli
  ```
- **Android Studio** (para builds Android)
- **Xcode** (para builds iOS, apenas em macOS)

## Instalação

Clone o repositório e instale as dependências:

```sh
  git clone https://github.com/seu-repositorio/comanda-digital.git
  cd comanda-digital
  npm install
```

## Executando o projeto em desenvolvimento

Para rodar o projeto no navegador:
```sh
ionic serve
```

Para rodar no emulador ou dispositivo:
```sh
ionic capacitor run android
ionic capacitor run ios  # Apenas no macOS
```

## Buildando o projeto

### Web (PWA)

Para gerar a build para a web (PWA):
```sh
ionic build
```
Os arquivos de build estarão na pasta `www/`.

Se quiser rodar como PWA, utilize:
```sh
npx http-server www
```

### Android (APK / AAB)

1. Gere a build web:
   ```sh
   ionic build
   ```
2. Sincronize os arquivos com o Capacitor:
   ```sh
   npx cap sync android
   ```
3. Abra o projeto no Android Studio:
   ```sh
   npx cap open android
   ```
4. Compile e gere um APK ou AAB dentro do Android Studio.

### iOS (Xcode / App Store)

1. Gere a build web:
   ```sh
   ionic build
   ```
2. Sincronize os arquivos com o Capacitor:
   ```sh
   npx cap sync ios
   ```
3. Abra o projeto no Xcode:
   ```sh
   npx cap open ios
   ```
4. Configure o certificado e a assinatura digital, depois construa o app no Xcode.

## Personalização

Edite as configurações do Capacitor em `capacitor.config.ts`.

Caso precise de variáveis de ambiente, crie um arquivo `.env` e utilize bibliotecas como `dotenv` para carregá-las no Angular.

## Contribuição

Sinta-se à vontade para abrir **issues** ou **pull requests** para melhorias no projeto.

## Licença

Este projeto está sob a licença MIT.

