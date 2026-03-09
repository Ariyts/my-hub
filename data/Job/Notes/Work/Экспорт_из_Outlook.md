---
id: "olt9c1vvimmiz8j3c"
title: "Экспорт из Outlook"
tags: []
isFavorite: false
order: 2
createdAt: "2026-03-09T09:26:37.224Z"
updatedAt: "2026-03-09T19:26:00.588Z"
---
# Запрос как можно выгрузить с outlook  адресную книгу в какой то формат  txt, cvs  и т.д. у меня много записей как то это возможно получить чтобы не руками перебивать?
    


Экспорт адресной книги из Outlook
Способ 1: Встроенный экспорт в CSV (самый простой)
Outlook (классический, desktop)

    Файл → Открыть и экспортировать → Импорт и экспорт
    Выберите «Экспорт в файл» → Далее
    Выберите «Значения, разделённые запятыми» (CSV) → Далее
    Выберите папку «Контакты» (Contacts) → Далее
    Укажите путь и имя файла → Готово

    Получите .csv файл, который открывается в Excel, Google Sheets, любом текстовом редакторе.

Способ 2: Outlook в вебе (OWA / Microsoft 365)

    Зайдите на outlook.live.com или outlook.office.com
    Нажмите значок «Люди» (People) внизу слева
    Справа вверху: «Управление контактами» → «Экспорт контактов»
    Выберите все контакты или нужную папку
    Нажмите «Экспорт» → скачается .csv

Способ 3: Через PowerShell (если Exchange / Microsoft 365)

PowerShell

# Подключение к Exchange Online
Connect-ExchangeOnline

# Экспорт GAL (глобальной адресной книги)
Get-GlobalAddressList | Get-Recipient | Select-Object DisplayName, PrimarySmtpAddress | Export-Csv -Path "C:\contacts.csv" -NoTypeInformation -Encoding UTF8

# Или все почтовые ящики
Get-Mailbox -ResultSize Unlimited | Select-Object DisplayName, PrimarySmtpAddress, Department, Title | Export-Csv -Path "C:\mailboxes.csv" -NoTypeInformation -Encoding UTF8

Способ 4: Через VBA макрос (если нужны все поля)

В Outlook нажмите Alt+F11, вставьте модуль:

vba

Sub ExportContacts()
    Dim olFolder As Outlook.MAPIFolder
    Dim olItem As Object
    Dim filePath As String
    Dim fileNum As Integer
    
    Set olFolder = Application.GetNamespace("MAPI").GetDefaultFolder(olFolderContacts)
    
    filePath = "C:\contacts_export.csv"
    fileNum = FreeFile
    
    Open filePath For Output As #fileNum
    
    ' Заголовки
    Print #fileNum, "Имя;Фамилия;Email;Телефон;Компания;Должность"
    
    For Each olItem In olFolder.Items
        If TypeOf olItem Is Outlook.ContactItem Then
            Dim c As Outlook.ContactItem
            Set c = olItem
            Print #fileNum, c.FirstName & ";" & c.LastName & ";" & _
                           c.Email1Address & ";" & c.BusinessTelephoneNumber & ";" & _
                           c.CompanyName & ";" & c.JobTitle
        End If
    Next
    
    Close #fileNum
    MsgBox "Экспортировано в " & filePath
End Sub

Способ 5: Экспорт в vCard (.vcf)

    Откройте Контакты в Outlook
    Выделите все: Ctrl+A
    Файл → Сохранить как → формат vCard (.vcf)

    ⚠️ Может создать отдельный файл на каждый контакт.

Какой способ выбрать?
Ситуация	Рекомендация
Личные контакты, < 1000	Способ 1 (CSV через меню)
Microsoft 365 в браузере	Способ 2 (OWA)
Корпоративная GAL (глобальная книга)	Способ 3 (PowerShell)
Нужна гибкость по полям	Способ 4 (VBA)
Важно про корпоративную GAL

Если вам нужна именно глобальная адресная книга компании (а не личные контакты), то:

    Через интерфейс Outlook она напрямую не экспортируется
    Нужно либо PowerShell (способ 3), либо попросить администратора Exchange
    Обходной путь: скопировать контакты из GAL в личную папку контактов, затем экспортировать

Какой у вас Outlook — десктопный, веб, какая версия? Уточню инструкцию под вашу ситуацию.


--- 
