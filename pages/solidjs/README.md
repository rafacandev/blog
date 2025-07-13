# Guia Rápido: Configuração de SolidJS + Vite + TailwindCSS + DaisyUI

Este guia descreve um fluxo para configurar um projeto **SolidJS** com **Vite**, **TailwindCSS** e **DaisyUI**.

## 1. Criando o Projeto com SolidJS + Vite

Vamos iniciar com o template oficial do SolidJS utilizando Vite e Vitest para testes.
Referência: [https://github.com/solidjs/templates](https://github.com/solidjs/templates)

### Comando:

```bash
# Criação do projeto com template JavaScript + Vitest
npx degit solidjs/templates/js-vitest my-solid-project

cd my-solid-project

# Instalar dependências
npm install

# Rodar o projeto localmente
npm start
```

## 2. Instalando e Configurando o TailwindCSS

O próximo passo é integrar o TailwindCSS para estilização rápida e flexível.
Referência: [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite)

### Instalação:

```bash
npm install tailwindcss @tailwindcss/vite
```

### Configuração do Vite (`vite.config.js`):

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

### Criando o arquivo de estilos:

Crie o arquivo `src/index.css` com o seguinte conteúdo:

```css
@import "tailwindcss";
```

### Importando no projeto:

No `src/index.jsx`, adicione:

```js
import './index.css'
```

### Verificação:

Execute o projeto:

```bash
npm start
```

Ao abrir o navegador, você verá que o layout mudou. Isso indica que o **TailwindCSS** já está ativo e funcionando corretamente.


## 3. Instalando e Configurando o DaisyUI**

O **DaisyUI** adiciona uma camada de componentes pré-prontos e temas ao Tailwind, acelerando ainda mais o desenvolvimento.
Referência: [https://daisyui.com/docs/install/solid/](https://daisyui.com/docs/install/solid/)

### Instalação:

```bash
npm install daisyui@latest
```

### Ativando o DaisyUI:

No `src/index.css`, adicione o DaisyUI como plugin:

```css
@import "tailwindcss";
@plugin "daisyui";
```

## 4. Validando

Vamos testar a configuração incluindo um botão estilizado pelo DaisyUI.

Abra o arquivo `src/todo-list.jsx` e altere o botão de adicionar tarefa:

```jsx
<button class="btn">
  Add Todo
</button>
```

### Resultado:

Ao recarregar a aplicação no navegador, o botão já estará com o estilo padrão do **DaisyUI** aplicado, indicando que a integração está funcionando perfeitamente.
