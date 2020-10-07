define({ "api": [
  {
    "type": "get",
    "url": "/bebes",
    "title": "Listagem",
    "description": "<p>Listagem dos bebes de uma determinada mãe</p>",
    "group": "Bebês",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acesso.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n[\n  {\n      \"id_bebe\":7,\n      \"nome\":\"Enzo Gabriel\",\n      \"data_parto\":\"2020-08-28\",\n      \"semanas_gest\": 35,\n      \"dias_gest\":5,\n      \"peso\":2.5,\n      \"tipo_parto\":true, // false: parto normal | true: cesaria\n      \"local\":\"UCI\",\n  },\n  {\n      \"id_bebe\":8,\n      \"nome\":\"Valentina\",\n      \"data_parto\":\"2020-08-28\",\n      \"semanas_gest\": 35,\n      \"dias_gest\":5,\n      \"peso\":2.7,\n      \"tipo_parto\":true, // false: parto normal | true: cesaria\n      \"local\":\"UCI\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Bebês",
    "name": "GetBebes"
  },
  {
    "type": "post",
    "url": "/bebes",
    "title": "Cadastro",
    "group": "Bebês",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acesso.</p>"
          }
        ]
      }
    },
    "parameter": {
      "examples": [
        {
          "title": "Exemplo Request:",
          "content": "{\n    \"nome\":\"Enzo Gabriel\",\n    \"data_parto\":\"2020-08-28\",\n    \"semanas_gest\": 35,\n    \"dias_gest\":5,\n    \"peso\":2.5,\n    \"apgar1\":8,\n    \"apgar2\":10,\n    \"tipo_parto\":true, // false: parto normal | true: cesaria\n    \"local\":\"UCI Neonatal\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n  {\n      \"id_bebe\":7,\n      \"nome\":\"Enzo Gabriel\"\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Bebês",
    "name": "PostBebes"
  },
  {
    "type": "get",
    "url": "/maes/:id",
    "title": "Dados da mae",
    "description": "<p>Retorna os dados da mae do id informado</p>",
    "group": "Mães",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Id da mãe.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acesso.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso:",
          "content": "{\n\"id\": 1,\n\"email\": \"fulana@email.com\",\n\"nome\": \"Fulana de Tal\",\n\"ultimo_acesso\": \"2020-09-24T17:32:34.810Z\",\n\"imagem_mae\": null,\n\"imagem_pai\": null,\n\"bebes\": [\n    {\n    \"id\": 1,\n    \"nome\": \"Enzo Gabriel\",\n    \"data_parto\": \"2020-08-28T03:00:00.000Z\",\n    \"semanas_gest\": 35,\n    \"dias_gest\": 5,\n    \"peso\": 2.5,\n    \"imagem_bebe\": null,\n    \"tipo_parto\": true,\n    \"local\": \"UCI\",\n    \"mae_id\": 1,\n    \"ordenhas\": [\n        {\n        \"id\": 1,\n        \"qtd_leite\": 100,\n        \"data_hora\": \"2020-09-24T17:40:31.501Z\",\n        \"mama\": \"D\",\n        \"duracao\": 5\n        }\n    ]\n    }\n]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Mães",
    "name": "GetMaesId"
  },
  {
    "type": "post",
    "url": "/alterarsenha",
    "title": "Alterar senha",
    "description": "<p>Altera a senha da mãe logada</p>",
    "group": "Mães",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acesso.</p>"
          }
        ]
      }
    },
    "parameter": {
      "examples": [
        {
          "title": "Exemplo Request:",
          "content": "{\n    \"senha\":\"novasenha\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Mães",
    "name": "PostAlterarsenha"
  },
  {
    "type": "post",
    "url": "/esqueceusenha",
    "title": "Esqueceu sua senha",
    "description": "<p>Mãe recebe um email com um link para alteração da sua senha.</p>",
    "group": "Mães",
    "parameter": {
      "examples": [
        {
          "title": "Exemplo Request:",
          "content": "{\n    \"email\":\"fulana@email.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Mães",
    "name": "PostEsqueceusenha"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "description": "<p>Realiza o login da mae e retorna o token de acesso.</p>",
    "group": "Mães",
    "parameter": {
      "examples": [
        {
          "title": "Exemplo Request:",
          "content": "{\n    \"email\":\"fulana@email.com\",\n    \"senha\":\"abc123\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n  {\n      \"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5bGFuQGJvc2Nhcmluby5jb20iLCJwYXNzd29yZCI6InlhMGdzcWh5NHd6dnV2YjQifQ.yN_8-ge9mFgsnYHnPEh_ZzNP7YKvSbQ3Alug9HMCsM\",\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Mães",
    "name": "PostLogin"
  },
  {
    "type": "post",
    "url": "/maes",
    "title": "Cadastro",
    "group": "Mães",
    "parameter": {
      "examples": [
        {
          "title": "Exemplo Request:",
          "content": "{\n    \"email\":\"fulana@email.com\",\n    \"senha\":\"abc123\",\n    \"nome\": \"Fulana de Tal\",\n    \"data_nascimento\":\"1990-05-05\",\n    \"amamentou_antes\":false,\n    \"companheiro\":true,\n    \"moram_juntos\":\"2 anos\", // caso nao more junto enviar NULL\n    \"escolaridade\":\"Ensino Medio Completo\",\n    \"renda\":\"Entre 1 e 3 salarios minimos\",\n    \"qtd_gravidez\":2\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n  {\n      \"id\":1\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Mães",
    "name": "PostMaes"
  },
  {
    "type": "get",
    "url": "/bebes/:bebe_id/ordenhas",
    "title": "Listagem",
    "description": "<p>Lista uma ordenha do bebe de id informado</p>",
    "group": "Ordenhas",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acesso.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso: Status 200",
          "content": "\n {\n  \"id\": 1,\n  \"nome\": \"Enzo Gabriel\",\n  \"ordenhas\": [\n    {\n      \"id\": 1,\n      \"data_hora\": \"2020-09-24T17:40:31.501Z\",\n      \"qtd_leite\": 100,\n      \"mama\": \"D\",\n      \"duracao\": 5,\n      \"bebe_id\": 1\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Ordenhas",
    "name": "GetBebesBebe_idOrdenhas"
  },
  {
    "type": "post",
    "url": "/bebes/:bebe_id/ordenhas",
    "title": "Cadastro",
    "description": "<p>Cadastra uma ordenha do bebe de id informado</p>",
    "group": "Ordenhas",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acesso.</p>"
          }
        ]
      }
    },
    "parameter": {
      "examples": [
        {
          "title": "Exemplo Request:",
          "content": "{\n    \"qtd_leite\":100,\n    \"mama\":\"D\",\n    \"duracao\":5\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes.ts",
    "groupTitle": "Ordenhas",
    "name": "PostBebesBebe_idOrdenhas"
  }
] });
