## Produção Musical no Linux

### Editor

Para produção musical no Linux, utilizo o [Ardour](https://ardour.org/), uma poderosa estação de trabalho digital de áudio (DAW) de código aberto.

### Plugins

Sempre que possível, dê preferência a plugins no formato **LV2**, que oferecem melhor integração e desempenho em ambientes Linux. Para instalar, basta salvar os arquivos na pasta `$HOME/.lv2`. A maioria dos aplicativos — incluindo o Ardour — detecta automaticamente os plugins a partir desse diretório.

#### Plugins disponíveis via `apt`

* `lsp-plugins-lv2`
  Coleção variada de plugins, com destaque para o **Parameterized EQ** e o **Compressor**.

* `calf-plugins`
  Conjunto de plugins do **Calf Studio**, incluindo sintetizadores, amplificadores e efeitos diversos.

* `mda-lv2`
  Port dos plugins clássicos **MDA** (Paul Kellett) para o formato LV2.

* `dragonfly-reverb-lv2`
  Excelente reverb.

#### Plugins nativos no formato LV2

* [**Airwindows**](https://www.airwindows.com/)
  Coleção extensa de plugins com foco em processamento de áudio de alta qualidade. Famosos pela interface minimalista e utilitária — não espere gráficos bonitos, apenas resultado sonoro.

* [**Neural Amp Modeler (NAM)**](https://www.tone3000.com/)
  Simulador de amplificadores baseado em redes neurais. Ideal para guitarristas e baixistas que buscam timbres realistas com baixo consumo de CPU.

* [**TAL Vocoder**](https://tal-software.com/products/tal-vocoder)
  Free vocoder.