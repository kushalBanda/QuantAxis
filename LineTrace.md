# LineTrace Codebase Analysis

### File Structure Summary
- Total Files: 217
- Total Directories: 47
- File Extensions: .md: 8, .lock: 2, .toml: 1, .py: 26, .adoc: 1, .js: 21, .json: 11, .html: 54, .css: 9, .ts: 33, .map: 25, .graphql: 8, .xml: 1, .info: 1, .png: 2, .snap: 1, .ico: 2, .txt: 3, .tsx: 4, .svg: 1

### Directory Tree
```
  ├── LICENSE
  ├── server
   │  ├── app
   │  │  ├── config
   │  │  │  ├── env.py
   │  │  │  ├── cors.py
   │  │  │  ├── __init__.py
   │  │  │  └── exceptions.py
   │  │  ├── auth
   │  │  ├── utils
   │  │  ├── airflow
   │  │  │  └── __init__.py
   │  │  ├── schema
   │  │  ├── ai
   │  │  │  ├── tools
   │  │  │  │  └── __init__.py
   │  │  │  ├── mcp
   │  │  │  │  └── __init__.py
   │  │  │  └── prompts
   │  │  │    └── __init__.py
   │  │  ├── db
   │  │  │  ├── DB.adoc
   │  │  │  ├── health.py
   │  │  │  ├── session.py
   │  │  │  ├── __init__.py
   │  │  │  ├── types.py
   │  │  │  ├── pool.py
   │  │  │  ├── dependencies.py
   │  │  │  └── schema.py
   │  │  ├── api
   │  │  │  ├── routers
   │  │  │  ├── __init__.py
   │  │  │  └── controllers
   │  │  │    └── __init__.py
   │  │  ├── telemetry
   │  │  │  └── logger.py
   │  │  └── services
   │  │    ├── equity
   │  │     │  ├── technicalIndicators.py
   │  │     │  ├── equity.py
   │  │     │  ├── client.py
   │  │     │  ├── __init__.py
   │  │     │  ├── symbol.py
   │  │     │  └── historical.py
   │  │    └── index
   │  │       └── __init__.py
   │  ├── uv.lock
   │  ├── pyproject.toml
   │  ├── docs
   │  ├── AGENTS.md
   │  └── main.py
  ├── README.md
  ├── LineTrace.md
  ├── stock-nse-india
   │  ├── QWEN.md
   │  ├── LICENSE
   │  ├── Dockerfile
   │  ├── jest.config.js
   │  ├── docs
   │  │  ├── index.html
   │  │  ├── modules.html
   │  │  ├── classes
   │  │  │  └── NseIndia.html
   │  │  ├── enums
   │  │  │  └── ApiList.html
   │  │  ├── assets
   │  │  │  ├── highlight.css
   │  │  │  ├── main.js
   │  │  │  ├── style.css
   │  │  │  └── search.js
   │  │  └── interfaces
   │  │    ├── OptionsData.html
   │  │    ├── Datum.html
   │  │    ├── EquityTradeInfo.html
   │  │    ├── MarketState.html
   │  │    ├── EquityMaster.html
   │  │    ├── DateRange.html
   │  │    ├── EquityHistoricalInfo.html
   │  │    ├── IndexOptionChainData.html
   │  │    ├── EquityCorporateInfo.html
   │  │    ├── EquityHistoricalData.html
   │  │    ├── CommodityOptionChainData.html
   │  │    ├── OptionsDetails.html
   │  │    ├── CircularsData.html
   │  │    ├── Filtered.html
   │  │    ├── EquityMetadata.html
   │  │    ├── CommodityRecords.html
   │  │    ├── IndexEquityInfo.html
   │  │    ├── EquitySecurityInfo.html
   │  │    ├── EquityOptionChainData.html
   │  │    ├── LatestCircularData.html
   │  │    ├── EquityDetails.html
   │  │    ├── EquityPreOpenMarket.html
   │  │    ├── MarketStatus.html
   │  │    ├── MarketCap.html
   │  │    ├── MarketTurnover.html
   │  │    ├── AllIndicesData.html
   │  │    ├── IndexDetails.html
   │  │    ├── EquityPriceInfo.html
   │  │    ├── Glossary.html
   │  │    ├── IndicativeNifty50.html
   │  │    ├── PreOpenMarketData.html
   │  │    ├── TechnicalIndicators.html
   │  │    ├── Holiday.html
   │  │    ├── EquityInfo.html
   │  │    ├── SeriesData.html
   │  │    ├── IndexNamesData.html
   │  │    ├── OptionChainContractInfo.html
   │  │    ├── PreOpenDetails.html
   │  │    ├── IndexRecords.html
   │  │    ├── GiftNifty.html
   │  │    ├── IntradayData.html
   │  │    ├── MergedDailyReportsData.html
   │  │    ├── EquityOptionChainItem.html
   │  │    └── HolidaysBySegment.html
   │  ├── README.md
   │  ├── yarn.lock
   │  ├── package-lock.json
   │  ├── package.json
   │  ├── examples
   │  │  └── basic.js
   │  ├── scripts
   │  │  └── setup-gpr.js
   │  ├── tsconfig.json
   │  ├── build
   │  │  ├── constants.js
   │  │  ├── constants.d.ts
   │  │  ├── interface.js
   │  │  ├── routes.d.ts.map
   │  │  ├── graphql-schema
   │  │  │  ├── equity.graphql
   │  │  │  ├── stockIndex.graphql
   │  │  │  ├── root.graphql
   │  │  │  └── inputs.graphql
   │  │  ├── swaggerDocOptions.js.map
   │  │  ├── swaggerDocOptions.d.ts.map
   │  │  ├── server.d.ts
   │  │  ├── root.resolver.js
   │  │  ├── interface.js.map
   │  │  ├── server.d.ts.map
   │  │  ├── server.js
   │  │  ├── root.resolver.d.ts
   │  │  ├── index.js
   │  │  ├── constants.js.map
   │  │  ├── cli
   │  │  │  ├── api.d.ts
   │  │  │  ├── api.d.ts.map
   │  │  │  ├── index.js
   │  │  │  ├── index.js.map
   │  │  │  ├── api.js.map
   │  │  │  ├── api.js
   │  │  │  ├── index.d.ts
   │  │  │  └── index.d.ts.map
   │  │  ├── server.js.map
   │  │  ├── root.resolver.js.map
   │  │  ├── helpers.js.map
   │  │  ├── utils.d.ts
   │  │  ├── utils.d.ts.map
   │  │  ├── root.resolver.d.ts.map
   │  │  ├── routes.js
   │  │  ├── helpers.d.ts.map
   │  │  ├── interface.d.ts.map
   │  │  ├── swaggerDocOptions.d.ts
   │  │  ├── swaggerDocOptions.js
   │  │  ├── helpers.js
   │  │  ├── index.js.map
   │  │  ├── utils.js
   │  │  ├── interface.d.ts
   │  │  ├── utils.js.map
   │  │  ├── helpers.d.ts
   │  │  ├── index.d.ts
   │  │  ├── routes.js.map
   │  │  ├── constants.d.ts.map
   │  │  ├── routes.d.ts
   │  │  └── index.d.ts.map
   │  ├── mcp-config.json
   │  ├── coverage
   │  │  ├── clover.xml
   │  │  ├── lcov.info
   │  │  ├── lcov-report
   │  │  │  ├── index.html
   │  │  │  ├── block-navigation.js
   │  │  │  ├── utils.ts.html
   │  │  │  ├── prettify.js
   │  │  │  ├── index.ts.html
   │  │  │  ├── favicon.png
   │  │  │  ├── prettify.css
   │  │  │  ├── sorter.js
   │  │  │  ├── base.css
   │  │  │  ├── sort-arrow-sprite.png
   │  │  │  └── helpers.ts.html
   │  │  └── coverage-final.json
   │  └── src
   │    ├── utils.spec.ts
   │    ├── routes.ts
   │    ├── swaggerDocOptions.ts
   │    ├── helpers.ts
   │    ├── index.spec.ts
   │    ├── equity.graphql
   │    ├── utils.ts
   │    ├── stockIndex.graphql
   │    ├── root.graphql
   │    ├── cli
   │     │  ├── @types
   │     │  │  ├── asciichart.d.ts
   │     │  │  └── ohlc.d.ts
   │     │  ├── api.ts
   │     │  └── index.ts
   │    ├── root.resolver.ts
   │    ├── constants.ts
   │    ├── helpers.spec.ts
   │    ├── inputs.graphql
   │    ├── interface.ts
   │    ├── index.ts
   │    ├── server.ts
   │    └── __snapshots__
   │       └── utils.spec.ts.snap
  └── client
     ├── README.md
     ├── public
      │  ├── favicon.ico
      │  ├── index.html
      │  ├── manifest.json
      │  └── robots.txt
     ├── package-lock.json
     ├── package.json
     ├── tsconfig.json
     ├── build
      │  ├── favicon.ico
      │  ├── index.html
      │  ├── asset-manifest.json
      │  ├── static
      │  │  ├── css
      │  │  │  ├── main.b37c5da2.css.map
      │  │  │  └── main.b37c5da2.css
      │  │  └── js
      │  │    ├── main.d679d1e7.js.map
      │  │    ├── main.d679d1e7.js
      │  │    ├── 453.eca5f793.chunk.js
      │  │    ├── 453.eca5f793.chunk.js.map
      │  │    └── main.d679d1e7.js.LICENSE.txt
      │  ├── manifest.json
      │  └── robots.txt
     ├── AGENTS.md
     ├── CLAUDE.md
     └── src
        ├── index.tsx
        ├── App.tsx
        ├── App.css
        ├── index.css
        ├── schema
         │  ├── symbols.ts
         │  └── equity.ts
        ├── reportWebVitals.ts
        ├── api
         │  ├── symbols.ts
         │  ├── client.ts
         │  └── equity.ts
        ├── pages
         │  ├── HomePage.css
         │  ├── DetailsPage.tsx
         │  ├── HomePage.tsx
         │  └── DetailsPage.css
        └── logo.svg
```

