/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const axios = require('axios');
var persistenceAdapter = getPersistenceAdapter();

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');


const languageStrings = {
    en: {
        translation: {
          WELCOME_MESSAGE: "Welcome to SportStore, to start try saying 'Alexa, show me the men's category', if you want to save your name for future purchases try saying 'my name is Juan'",
          HELP_MESSAGE: "Hello, do you need help?. You can display the men's or women's clothing categories, try saying 'Alexa, show me the women's category",
          REGISTER_MSG: "Welcome to SportStore %s, if you want to use another name try saying 'my name is Juan', to start try saying 'Alexa, show me the men's category'",
          CATEMUJER_MESSAGE: "Very well you have chosen to see women's clothes, if you want to see a specific type of garment try saying 'Alexa, show me the tops', you can also choose between sets or leggings",
          CATEHOMBRE_MESSAGE:"Very well you have chosen to see men's clothing, if you want to see a specific type of clothing try saying 'Alexa, show me the pants', you can also choose between shots or sports shirts",
          GOODBYE_MESSAGE: 'Goodbye %s , come back soon !',
          REFLECTOR_MESSAGE: 'You just triggered %s',
          FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
          ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
          PANTS_MESSAGE: 'Very well you have chosen to see pants',
          CAMISAS_MESSAGE: 'Very well you have chosen to see sports shirts',
          SHORTS_MESSAGE: 'Very well you have chosen to see shorts',
          CONJUNTOS_MESSAGE: 'Very well you have chosen to see sets',
          TOPS_MESSAGE: 'Very well you have chosen see tops',
          LEGGINS_MESSAGE: 'Very well you have chosen to see leggings',
          MAPA_MESSAGE: 'Here is the location you requested, you can visit our store in the center of Huejutla de Reyes',
          AVISO_MESSAGE: 'You can consult the privacy notice on the official SportStore site',
          MASVENDIDO_MESSAGE: 'In this section you can see the best sellers of the store'
        }
    },
    es: {
        translation: {
          WELCOME_MESSAGE: "Bienvenido a SportStore, para empezar prueba diciendo 'Alexa, muestrame la categoria de hombre', si deseas guardar tu nombre para futuras compras prueba diciendo 'mi nombre es Juan'",
          REGISTER_MSG: 'Bienvenido a SportStore %s , si deseas utilizar otro nombre prueba diciendo "mi nombre es Juan", para empezar prueba diciendo "Alexa, muestrame la categoria de hombre"',
          CATEMUJER_MESSAGE: 'Muy bien has elegido ver prendas de Dama, si quieres ver un tipo de prenda en especifico prueba diciendo "Alexa, muestrame los tops", tambien puedes elejir entre conjuntos o leggins',
          CATEHOMBRE_MESSAGE:'Muy bien has elegido ver prendas de hombre, si quieres ver un tipo de prenda en especifico prueba diciendo "Alexa, muestrame los pants", tambien puedes elejir entre shots o las camisas deportivas',
          HELP_MESSAGE: 'Hola necesitas ayuda?. Puedes visualizar las categorias de ropa de hombre o mujer, intenta decir "Alexa, muestrame la categoria de mujer"',
          GOODBYE_MESSAGE: 'Adiós %s , vuelve pronto!',
          REFLECTOR_MESSAGE: 'Acabas de activar %s',
          FALLBACK_MESSAGE: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
          ERROR_MESSAGE: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez.',
          PANTS_MESSAGE: 'Muy bien has elegido ver pants',
          CAMISAS_MESSAGE: 'Muy bien has elegido ver camisas deportivas',
          SHORTS_MESSAGE: 'Muy bien has elegido ver shorts',
          CONJUNTOS_MESSAGE: 'Muy bien has elegido ver conjuntos',
          TOPS_MESSAGE: 'Muy bien has elegido ver tops',
          LEGGINS_MESSAGE: 'Muy bien has elegido ver leggins',
          MAPA_MESSAGE: 'Aquí está la ubicación que solicitaste, puedes visitar nuestra tienda en el centro de Huejutla de Reyes',
          AVISO_MESSAGE: 'Puedes consultar el aviso de privacidad en el sitio oficial de SportStore',
          MASVENDIDO_MESSAGE: 'En esta sección puedes visualizar lo mas vendido de la tienda'
        }
    }
}
function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'user_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}
const DOCUMENT_ID1 = "bienvenido";
const DOCUMENT_ID2 = "CateMujer";
const DOCUMENT_ID3 = "ConjuntosMujer";
const DOCUMENT_ID4 = "LegginsMujer";
const DOCUMENT_ID5 = "TopsMujer";
const DOCUMENT_ID6 = "CateHombre";
const DOCUMENT_ID7 = "CamisasHombre";
const DOCUMENT_ID8 = "PantsHombre";
const DOCUMENT_ID9 = "ShortsHombre";
const DOCUMENT_ID10 = "ayudaa";
const DOCUMENT_ID11 = "Error";
const DOCUMENT_ID12 = "AvisoPriv";
const DOCUMENT_ID13 = "MasVendido";
const DOCUMENT_ID14 = "adioos";


const datasource14 = {
    "headlineTemplateData": {
        "type": "object",
        "objectId": "headlineSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg3l7tf-7c6261cc-dfb2-4cc3-96c5-2e094190798b.png/v1/fill/w_300,h_200/0001_by_rubialvv_dg3l7tf-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzY1IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzNsN3RmLTdjNjI2MWNjLWRmYjItNGNjMy05NmM1LTJlMDk0MTkwNzk4Yi5wbmciLCJ3aWR0aCI6Ijw9NTQ4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.mNqaBSZbUY2VPCw7M5J6sBoASG731Iq48itu_F7qcxM",
                        "size": "large"
                    }
                ]
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Hasta luego"
                }
            },
            "DataUser": {
                "text": "Usuario"
            },
            "logoUrl": "https://acortar.link/zrVT0e"
        }
    }
};

const datasource13 = {
    "imageListData": {
        "headerTitle": "Lo más vendido",
        "headerAttributionImage": "https://acortar.link/zrVT0e",
        "listItemsToShow": [
            {
                "primaryText": "Playera Puma",
                "secondaryText": "$899 MX",
                "imageSource": "https://cdn.shopify.com/s/files/1/1247/6259/products/523268-92-1_600x.jpg?v=1680058813",
                "imageShowProgressBar": false,
                "ratingSlotMode": "multiple",
                "ratingNumber": 2.87
            },
            {
                "primaryText": "Top Adidas",
                "secondaryText": "$450 MX",
                "tertiaryText": "Tertiary text",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/af33228ac0bd49bcaeddade500372797_9366/sujetador-adidas-powerreact-training-medium-support-3-bandas.jpg",
                "ratingSlotMode": "multiple",
                "ratingNumber": 4.5
            },
            {
                "primaryText": "Short Designed Running",
                "secondaryText": "$690 MX",
                "ratingSlotMode": "multiple",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/d55a2574d7c14d5383c4af020121e9cc_9366/shorts-essentials-chelsea-3-franjas-aeroready.jpg",
                "ratingNumber": 5
            },
            {
                "primaryText": "Conjunto básico",
                "secondaryText": "$400 MX",
                "ratingSlotMode": "multiple",
                "imageSource": "https://i.linio.com/p/2f093913430eaacb2b64ff4c0faea184-product.jpg",
                "ratingNumber": 3.8
            }
        ]
    }
};

const datasource12 = {
    "headlineData": {
        "title": "Aviso de privacidad",
        "primaryText": "Consulta el siguiente link:",
        "secondaryText": "https://sportstore.proyectowebuni.com/#/home/aviso-privacidad",
        "footerHintText": "Intenta decir, \"Alexa, muestrame los tops \"",
        "headerAttributionImage": "https://acortar.link/zrVT0e"
    }
};

const datasource11 = {
    "headlineData": {
        "title": "SportStore",
        "primaryText": "Error",
        "secondaryText": "No entendi lo que dijiste",
        "footerHintText": "Intenta decir, \"Alexa, muestrame los conjuntos \"",
        "headerAttributionImage": "https://acortar.link/zrVT0e"
    }
};

const datasource10 = {
    "headlineData": {
        "title": "Ayuda",
        "secondaryText": "Puedes visualizar las categorias de ropa de hombre o mujer",
        "footerHintText": "Intenta decir, \"Alexa, muestrame la categoria de mujer\"",
        "headerAttributionImage": "https://acortar.link/zrVT0e"
    }
};


const datasource = {
    "headlineTemplateData": {
        "type": "object",
        "objectId": "headlineSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg3l7tf-7c6261cc-dfb2-4cc3-96c5-2e094190798b.png/v1/fill/w_300,h_200/0001_by_rubialvv_dg3l7tf-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzY1IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzNsN3RmLTdjNjI2MWNjLWRmYjItNGNjMy05NmM1LTJlMDk0MTkwNzk4Yi5wbmciLCJ3aWR0aCI6Ijw9NTQ4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.mNqaBSZbUY2VPCw7M5J6sBoASG731Iq48itu_F7qcxM",
                        "size": "large"
                    }
                ]
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Bienvenido"
                }
            },
            "DataUser": {
                "text": "Usuario"
            },
            "logoUrl": "https://acortar.link/zrVT0e",
            "hintText": "Intenta decir, \"Alexa, muestrame la categoria de hombre\""
        }
    }
};

const datasource9 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Shorts Deportivos",
        "styles": {
            "customPrimaryText": {
                "values": [
                    {
                        "color": "blue"
                    }
                ]
            }
        },
        "listItems": [
            {
                "primaryText": "Shorts Deportivo GYM",
                "secondaryText": "$169",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_961089-MLM44730773239_012021-O.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[2].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Designed Running",
                "secondaryText": "$690",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/d55a2574d7c14d5383c4af020121e9cc_9366/shorts-essentials-chelsea-3-franjas-aeroready.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[4].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Nike",
                "secondaryText": "$849",
                "imageSource": "https://www.innovasport.com/medias/IS-HF7152-1.jpg?context=bWFzdGVyfGltYWdlc3w3NjgzfGltYWdlL2pwZWd8aW1hZ2VzL2hlNC9oOTUvMTA1ODA5OTg3ODMwMDYuanBnfGNjYTQ2NmU1MGRkZTg1ZmQ3YjI0Mjk5MjFkMzVlNmUwZWE4ODAzMDE4ZTU5YmVkMGQ4YThhNzk2ZDUwMzE4ZDk",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Wilson",
                "secondaryText": "$339",
                "imageSource": "https://cdn1.coppel.com/images/catalog/pr/1219932-1.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short gris Nike",
                "secondaryText": "$369",
                "imageSource": "https://ss205.liverpool.com.mx/sm/1130569734.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Entrenamiento Nike",
                "secondaryText": "$275",
                "imageSource": "https://www.innovasport.com/medias/short-nike-is-CU4943-010-1.png?context=bWFzdGVyfGltYWdlc3w3MjA1fGltYWdlL3BuZ3xpbWFnZXMvaDkzL2hkZC8xMDc4MTExODMzMjk1OC5wbmd8NDA5OTNmN2RiZmZjZmE1NWUzMDA0ODhlMTVjYmRjMzI1YzFlZDQwMDU2M2UyNDgwNmI4MTQ4N2Q4YTc5Zjg3Yw",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};

const datasource8 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Pants Deportivos",
        "styles": {
            "customPrimaryText": {
                "values": [
                    {
                        "color": "blue"
                    }
                ]
            }
        },
        "listItems": [
            {
                "primaryText": "Jogger Strip Fugitive",
                "secondaryText": "$359",
                "style": "customPrimaryText",
                "imageSource": "https://fugitivetrend.com/wp-content/uploads/2021/07/JoggerStripFugitiveTrend-1.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Adidas",
                "secondaryText": "$229",
                "imageSource": "https://m.media-amazon.com/images/I/51CwGR+bNIL._AC_SX569_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Puma",
                "secondaryText": "$1049",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_956642-MLM42688724749_072020-O.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Jogger Gym",
                "secondaryText": "183",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_688613-MLM48846965849_012022-O.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto Sudadera y Pants",
                "secondaryText": "$760",
                "imageSource": "https://m.media-amazon.com/images/I/61wMP6tON0L.AC_SL1500.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Adidas",
                "secondaryText": "$999",
                "imageSource": "https://i.linio.com/p/625fc9cdec2f7f8aee4e9be0ea6692fa-product.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};

const datasource7 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Camisetas Deportivas",
        "styles": {
            "customPrimaryText": {
                "values": [
                    {
                        "color": "blue"
                    }
                ]
            }
        },
        "listItems": [
            {
                "primaryText": "Playera Adidas",
                "secondaryText": "$159",
                "imageSource": "https://ss205.liverpool.com.mx/xl/1107335681.jpg.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Nike dri-FIT",
                "secondaryText": "$399",
                "imageSource": "https://cdn1.coppel.com/images/catalog/pr/1636382-1.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[3].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Puma",
                "secondaryText": "$899",
                "imageSource": "https://cdn.shopify.com/s/files/1/1247/6259/products/523268-92-1_600x.jpg?v=1680058813",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Adidas",
                "secondaryText": "$596",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/f75e9cf44c094843b788ae790094881e_9366/playera-adidas-rekive.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Kit Playeras Deportivas",
                "secondaryText": "$500",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_2X_753047-MLM46724040075_072021-F.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Deportiva Adidas",
                "secondaryText": "$529",
                "imageSource": "https://ss205.liverpool.com.mx/xl/1092434832.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};

const datasource6 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Categoria de Hombre",
        "listItems": [
            {
                "primaryText": "Jogger Strip Fugitive",
                "secondaryText": "$359",
                "style": "customPrimaryText",
                "imageSource": "https://fugitivetrend.com/wp-content/uploads/2021/07/JoggerStripFugitiveTrend-1.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Adidas",
                "secondaryText": "$159",
                "imageSource": "https://ss205.liverpool.com.mx/xl/1107335681.jpg.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Shorts Deportivo GYM",
                "secondaryText": "$169",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_961089-MLM44730773239_012021-O.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[2].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Nike dri-FIT",
                "secondaryText": "$399",
                "imageSource": "https://cdn1.coppel.com/images/catalog/pr/1636382-1.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[3].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Designed Running",
                "secondaryText": "$690",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/d55a2574d7c14d5383c4af020121e9cc_9366/shorts-essentials-chelsea-3-franjas-aeroready.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[4].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Adidas",
                "secondaryText": "$229",
                "imageSource": "https://m.media-amazon.com/images/I/51CwGR+bNIL._AC_SX569_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Nike",
                "secondaryText": "$849",
                "imageSource": "https://www.innovasport.com/medias/IS-HF7152-1.jpg?context=bWFzdGVyfGltYWdlc3w3NjgzfGltYWdlL2pwZWd8aW1hZ2VzL2hlNC9oOTUvMTA1ODA5OTg3ODMwMDYuanBnfGNjYTQ2NmU1MGRkZTg1ZmQ3YjI0Mjk5MjFkMzVlNmUwZWE4ODAzMDE4ZTU5YmVkMGQ4YThhNzk2ZDUwMzE4ZDk",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Puma",
                "secondaryText": "$1049",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_956642-MLM42688724749_072020-O.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Puma",
                "secondaryText": "$899",
                "imageSource": "https://cdn.shopify.com/s/files/1/1247/6259/products/523268-92-1_600x.jpg?v=1680058813",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Jogger Gym",
                "secondaryText": "183",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_688613-MLM48846965849_012022-O.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Adidas",
                "secondaryText": "$596",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/f75e9cf44c094843b788ae790094881e_9366/playera-adidas-rekive.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Wilson",
                "secondaryText": "$339",
                "imageSource": "https://cdn1.coppel.com/images/catalog/pr/1219932-1.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Kit Playeras Deportivas",
                "secondaryText": "$500",
                "imageSource": "https://http2.mlstatic.com/D_NQ_NP_2X_753047-MLM46724040075_072021-F.webp",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short gris Nike",
                "secondaryText": "$369",
                "imageSource": "https://ss205.liverpool.com.mx/sm/1130569734.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto Sudadera y Pants",
                "secondaryText": "$760",
                "imageSource": "https://m.media-amazon.com/images/I/61wMP6tON0L.AC_SL1500.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Short Entrenamiento Nike",
                "secondaryText": "$275",
                "imageSource": "https://www.innovasport.com/medias/short-nike-is-CU4943-010-1.png?context=bWFzdGVyfGltYWdlc3w3MjA1fGltYWdlL3BuZ3xpbWFnZXMvaDkzL2hkZC8xMDc4MTExODMzMjk1OC5wbmd8NDA5OTNmN2RiZmZjZmE1NWUzMDA0ODhlMTVjYmRjMzI1YzFlZDQwMDU2M2UyNDgwNmI4MTQ4N2Q4YTc5Zjg3Yw",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Playera Deportiva Adidas",
                "secondaryText": "$529",
                "imageSource": "https://ss205.liverpool.com.mx/xl/1092434832.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Pants Adidas",
                "secondaryText": "$999",
                "imageSource": "https://i.linio.com/p/625fc9cdec2f7f8aee4e9be0ea6692fa-product.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};



const datasource5 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Tops de mujer",
        "styles": {
            "customPrimaryText": {
                "values": [
                    {
                        "color": "blue"
                    }
                ]
            }
        },
        "listItems": [
            {
                "primaryText": "Top básico",
                "secondaryText": "$250",
                "imageSource": "data:image/jpeg;base64,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",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[2].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top Adidas",
                "secondaryText": "$450",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/af33228ac0bd49bcaeddade500372797_9366/sujetador-adidas-powerreact-training-medium-support-3-bandas.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[3].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top adidas purple",
                "secondaryText": "$400",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4ea5935730b4f529475aee700d28cbc_9366/top-deportivo-hyperglam-techfit-zebra-soporte-medio.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top deportivo",
                "secondaryText": "$400",
                "imageSource": "https://contents.mediadecathlon.com/p1724908/k$33e3eb5e8fb8e11f871f1ddd8cba0ea1/top-sujetador-deportivo-cardio-training-domyos-fbra-500-mujer-blanco-negro.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top naranja",
                "secondaryText": "$400",
                "imageSource": "https://deportivoscarvajal.com/cdn/shop/files/Sintitulo-2_ae20a3ad-194d-4771-a706-ea92f1a5a97e_1000x1000.jpg?v=1686679188",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top ajustable",
                "secondaryText": "$400",
                "imageSource": "https://m.media-amazon.com/images/I/411MDpPBvVL._AC_SY400_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};

const datasource4 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Leggins de mujer",
        "styles": {
            "customPrimaryText": {
                "values": [
                    {
                        "color": "blue"
                    }
                ]
            }
        },
        "listItems": [
            {
                "primaryText": "Biker short",
                "secondaryText": "$250",
                "style": "customPrimaryText",
                "imageSource": "https://m.media-amazon.com/images/I/31eIqhfKc0S._SL500_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins nylon",
                "secondaryText": "$300",
                "imageSource": "https://img104.urbanic.com/goods-pic/de85cfbdf8284e51833854e214f39cfcUR_w1000_q90",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[4].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins morados",
                "secondaryText": "$250",
                "imageSource": "https://brooksrunning.com.mx/cdn/shop/products/221479_436_MV_Method_78_Tight.png?v=1633646377",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Biker short azul",
                "secondaryText": "$200",
                "imageSource": "https://m.media-amazon.com/images/I/31a7-llE-fS.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins al tobillo",
                "secondaryText": "$300",
                "imageSource": "https://m.media-amazon.com/images/I/61+sOue95kL._UL1500_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins Azul",
                "secondaryText": "$250",
                "imageSource": "https://static.dafiti.com.co/p/arequipe-1091-7769612-2-zoom.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};

const datasource3 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Categoria de mujer",
        "styles": {
            "customPrimaryText": {
                "values": [
                    {
                        "color": "blue"
                    }
                ]
            }
        },
        "listItems": [
            {
                "primaryText": "Conjunto Azul",
                "secondaryText": "$600",
                "imageSource": "https://drakon.com.co/wp-content/uploads/2021/11/Outfit-Deportivo-Azul-500x500.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto multicolor",
                "secondaryText": "$400",
                "imageSource": "https://images-na.ssl-images-amazon.com/images/I/61msfoM71IL._AC_UL330_SR330,330_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto básico",
                "secondaryText": "$400",
                "imageSource": "https://i.linio.com/p/2f093913430eaacb2b64ff4c0faea184-product.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto de invierno",
                "secondaryText": "$1000",
                "imageSource": "https://ss205.liverpool.com.mx/xl/1099567854.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto biker",
                "secondaryText": "$400",
                "imageSource": "https://m.media-amazon.com/images/I/51LB+bYOGvL.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto Nike",
                "secondaryText": "$800",
                "imageSource": "https://static.nike.com/a/images/t_default/11625737-9e7d-46ee-85bb-917aca9979a7/shorts-de-ciclismo-con-bolsillos-de-20-900-de-tiro-alto-y-media-sujeci%C3%B3n-universa-hl8WPk.png",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};

const datasource2 = {
    "gridListData": {
        "type": "object",
        "objectId": "gridListSample",
        "title": "Categoria de mujer",
        "styles": {
            "customPrimaryText": {
                "values": [
                    {
                        "color": "blue"
                    }
                ]
            }
        },
        "listItems": [
            {
                "primaryText": "Biker short",
                "secondaryText": "$250",
                "style": "customPrimaryText",
                "imageSource": "https://m.media-amazon.com/images/I/31eIqhfKc0S._SL500_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto Azul",
                "secondaryText": "$600",
                "imageSource": "https://drakon.com.co/wp-content/uploads/2021/11/Outfit-Deportivo-Azul-500x500.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top básico",
                "secondaryText": "$250",
                "imageSource": "data:image/jpeg;base64,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",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[2].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top Adidas",
                "secondaryText": "$450",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/af33228ac0bd49bcaeddade500372797_9366/sujetador-adidas-powerreact-training-medium-support-3-bandas.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[3].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins nylon",
                "secondaryText": "$300",
                "imageSource": "https://img104.urbanic.com/goods-pic/de85cfbdf8284e51833854e214f39cfcUR_w1000_q90",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[4].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top adidas purple",
                "secondaryText": "$400",
                "imageSource": "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4ea5935730b4f529475aee700d28cbc_9366/top-deportivo-hyperglam-techfit-zebra-soporte-medio.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto multicolor",
                "secondaryText": "$400",
                "imageSource": "https://images-na.ssl-images-amazon.com/images/I/61msfoM71IL._AC_UL330_SR330,330_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto básico",
                "secondaryText": "$400",
                "imageSource": "https://i.linio.com/p/2f093913430eaacb2b64ff4c0faea184-product.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto de invierno",
                "secondaryText": "$1000",
                "imageSource": "https://ss205.liverpool.com.mx/xl/1099567854.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins morados",
                "secondaryText": "$250",
                "imageSource": "https://brooksrunning.com.mx/cdn/shop/products/221479_436_MV_Method_78_Tight.png?v=1633646377",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Biker short azul",
                "secondaryText": "$200",
                "imageSource": "https://m.media-amazon.com/images/I/31a7-llE-fS.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto biker",
                "secondaryText": "$400",
                "imageSource": "https://m.media-amazon.com/images/I/51LB+bYOGvL.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Conjunto Nike",
                "secondaryText": "$800",
                "imageSource": "https://static.nike.com/a/images/t_default/11625737-9e7d-46ee-85bb-917aca9979a7/shorts-de-ciclismo-con-bolsillos-de-20-900-de-tiro-alto-y-media-sujeci%C3%B3n-universa-hl8WPk.png",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top deportivo",
                "secondaryText": "$400",
                "imageSource": "https://contents.mediadecathlon.com/p1724908/k$33e3eb5e8fb8e11f871f1ddd8cba0ea1/top-sujetador-deportivo-cardio-training-domyos-fbra-500-mujer-blanco-negro.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top naranja",
                "secondaryText": "$400",
                "imageSource": "https://deportivoscarvajal.com/cdn/shop/files/Sintitulo-2_ae20a3ad-194d-4771-a706-ea92f1a5a97e_1000x1000.jpg?v=1686679188",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Top ajustable",
                "secondaryText": "$400",
                "imageSource": "https://m.media-amazon.com/images/I/411MDpPBvVL._AC_SY400_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins al tobillo",
                "secondaryText": "$300",
                "imageSource": "https://m.media-amazon.com/images/I/61+sOue95kL._UL1500_.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Leggins Azul",
                "secondaryText": "$250",
                "imageSource": "https://static.dafiti.com.co/p/arequipe-1091-7769612-2-zoom.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.gridListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bbdb18d9-f765-4f55-9bd2-ffa98caddce7/dg2taxz-5a8386ff-d7ec-4600-a034-a917940c99d6.png/v1/fill/w_300,h_136/logo_sport_store2_by_rubialvv_dg2taxz-200h.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk3IiwicGF0aCI6IlwvZlwvYmJkYjE4ZDktZjc2NS00ZjU1LTliZDItZmZhOThjYWRkY2U3XC9kZzJ0YXh6LTVhODM4NmZmLWQ3ZWMtNDYwMC1hMDM0LWE5MTc5NDBjOTlkNi5wbmciLCJ3aWR0aCI6Ijw9NDM2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ka_xOKKczjPqpMXMYsw035NpjqKu3C18eeUU5a8kMr4"
    }
};



const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const nombre = sessionAttributes['nombre'];
        
        let speechText = requestAttributes.t('WELCOME_MESSAGE');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID1, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        if(nombre){
            speechText = requestAttributes.t('REGISTER_MSG', nombre)
            
             datasource.headlineTemplateData.properties.DataUser.text = nombre;

            // Crear la directiva APL con el nuevo datasource
            const aplDirective = createDirectivePayload(DOCUMENT_ID1, datasource);
            
            // Agrega la directiva APL a la respuesta
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

//AddUserIntent

const AddUserIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddUserIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;

        const nombre = intent.slots.nombre.value;
        
        sessionAttributes['nombre'] = nombre;
        
        if(nombre){
            datasource.headlineTemplateData.properties.DataUser.text = nombre;

            // Crear la directiva APL con el nuevo datasource
            const aplDirective = createDirectivePayload(DOCUMENT_ID1, datasource);
            
            // Agrega la directiva APL a la respuesta
            handlerInput.responseBuilder.addDirective(aplDirective);
        

        }

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('REGISTER_MSG', nombre))
            .reprompt(requestAttributes.t('HELP_MESSAGE'))
            .getResponse();
    }
};





const BuscarCategoriaIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'BuscarPrendaIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const categoria=handlerInput.requestEnvelope.request.intent.slots.categoria.value;
        
        if(categoria === 'de mujer'){
            var speakOutput = requestAttributes.t('CATEMUJER_MESSAGE');
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(DOCUMENT_ID2, datasource2);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
        }else if(categoria === 'de hombre'){
             speakOutput = requestAttributes.t('CATEHOMBRE_MESSAGE');
             if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID6, datasource6);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        }
    
         return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const TipoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'BuscarTipoPrendaIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const tipo=handlerInput.requestEnvelope.request.intent.slots.tipo.value;
        
        if(tipo === 'pants'){
            var speakOutput = requestAttributes.t('PANTS_MESSAGE');
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID8, datasource8);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        }else if(tipo === 'camisas deportivas'){
            speakOutput = requestAttributes.t('CAMISAS_MESSAGE');
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID7, datasource7);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        }else if(tipo === 'shorts'){
            speakOutput = requestAttributes.t('SHORTS_MESSAGE')
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID9, datasource9);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        }else if(tipo === 'conjuntos'){
            speakOutput = requestAttributes.t('CONJUNTOS_MESSAGE')
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID3, datasource3);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        }else if(tipo === 'tops'){
            speakOutput = requestAttributes.t('TOPS_MESSAGE')
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID5, datasource5);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        }else if(tipo === 'leggins'){
            speakOutput = requestAttributes.t('LEGGINS_MESSAGE')
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID4, datasource4);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        }
    
         return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};


const accessToken = 'pk.eyJ1IjoiZWR1YXJkbzE4MzQiLCJhIjoiY2xrNTRvY21pMGJzZzNzcGFnbTZiNThoMCJ9.2604HzCubnhQ2UpVq2zpeA';


const MostrarMapaIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MostrarMapaIntent';
  },
  async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      const location = 'Huejutla de Reyes, HGO'; // Puedes obtener esto desde el slot o el input del usuario

    // Construye la URL de la solicitud a la API de Mapbox
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${accessToken}`;

    try {
      // Realiza la solicitud a la API de Mapbox
      const response = await axios.get(apiUrl);

      // Extrae los datos de localización del mapa de la respuesta de la API
      const coordinates = response.data.features[0].geometry.coordinates;

      // Construye la URL de la imagen del mapa utilizando las coordenadas
      const mapImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${coordinates[0]},${coordinates[1]},13/800x600?access_token=${accessToken}`;

      // Aquí puedes utilizar los datos de la imagen del mapa para mostrarla en tu skill de Alexa
      // Por ejemplo, puedes enviar la URL de la imagen como respuesta a Alexa

      const speechText = requestAttributes.t('MAPA_MESSAGE');
      const cardImageUrl = mapImageUrl;

      return handlerInput.responseBuilder
        .speak(speechText)
        .withStandardCard('Mapa', speechText, cardImageUrl)
        .getResponse();
    } catch (error) {
      console.log('Error al llamar a la API de Mapbox:', error);
      // Aquí puedes manejar el error y enviar una respuesta adecuada a Alexa

      const errorMessage = 'Lo siento, no pude obtener el mapa en este momento. Por favor, intenta nuevamente más tarde.';
      return handlerInput.responseBuilder
        .speak(errorMessage)
        .getResponse();
    }
  },
};

const AvisoPrivacidadIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AvisoPrivacidadIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('AVISO_MESSAGE')
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID12, datasource12);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


const MasVendidoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MasVendidoIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('MASVENDIDO_MESSAGE');
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID13, datasource13);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('HELP_MESSAGE');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID10, datasource10);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const nombre = sessionAttributes['nombre'];
        
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID14, datasource14);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        if(nombre){
            var speechText = requestAttributes.t('GOODBYE_MESSAGE', nombre);
            datasource14.headlineTemplateData.properties.DataUser.text = nombre;

            // Crear la directiva APL con el nuevo datasource
            const aplDirective = createDirectivePayload(DOCUMENT_ID14, datasource14);
            
            // Agrega la directiva APL a la respuesta
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
 const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
 const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t(`REFLECTOR_MESSAGE, ${intentName}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('ERROR_MESSAGE');
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID11, datasource11);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}


const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AddUserIntentHandler,
        BuscarCategoriaIntentHandler,
        TipoIntentHandler,
        MostrarMapaIntentHandler,
        AvisoPrivacidadIntentHandler,
        MasVendidoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
            LocalizationInterceptor,
            LoggingRequestInterceptor,
            LoadAttributesRequestInterceptor)
        .addResponseInterceptors(
            LoggingResponseInterceptor,
            SaveAttributesResponseInterceptor)
        .withPersistenceAdapter(persistenceAdapter)
    .lambda();