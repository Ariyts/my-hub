---
id: "olt9c1vvimmiz8j3c"
title: "Экспорт из Outlook"
tags: []
isFavorite: false
order: "2"
createdAt: "2026-03-09T09:26:37.224Z"
updatedAt: "2026-03-09T19:33:31.973Z"
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

Экспорт корпоративной GAL через PowerShell
1. Подготовка — установка модуля

Откройте PowerShell от имени администратора:

PowerShell

# Установка модуля Exchange Online (один раз)
Install-Module -Name ExchangeOnlineManagement -Force -Scope CurrentUser

# Если уже установлен — обновите
Update-Module -Name ExchangeOnlineManagement

2. Подключение
Вариант А: Microsoft 365 / Exchange Online

PowerShell

# Подключение (откроется окно логина)
Import-Module ExchangeOnlineManagement
Connect-ExchangeOnline -UserPrincipalName ваш_email@company.com

Вариант B: Локальный Exchange Server (on-premises)

PowerShell

# Подключение к локальному Exchange
$Session = New-PSSession -ConfigurationName Microsoft.Exchange `
    -ConnectionUri http://ваш-exchange-сервер/PowerShell/ `
    -Authentication Kerberos
Import-PSSession $Session

3. Экспорт — основные команды
3.1 Все почтовые ящики (самый частый случай)

PowerShell

Get-Mailbox -ResultSize Unlimited | 
    Select-Object DisplayName, PrimarySmtpAddress, Department, Title, Office, Phone | 
    Export-Csv -Path "C:\GAL_Export.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"

3.2 Все получатели (ящики + группы + контакты + ресурсы)

PowerShell

Get-Recipient -ResultSize Unlimited | 
    Select-Object DisplayName, PrimarySmtpAddress, RecipientType, Department, Company | 
    Export-Csv -Path "C:\GAL_All_Recipients.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"

3.3 Максимально подробный экспорт

PowerShell

Get-User -ResultSize Unlimited | 
    Select-Object DisplayName, 
                  UserPrincipalName, 
                  FirstName, 
                  LastName, 
                  Title,               # Должность
                  Department,          # Отдел
                  Company,             # Компания
                  Office,              # Офис
                  City,                # Город
                  StateOrProvince,     # Область
                  CountryOrRegion,     # Страна
                  Phone,               # Телефон
                  MobilePhone,         # Мобильный
                  Fax,                 # Факс
                  StreetAddress,       # Адрес
                  PostalCode,          # Индекс
                  Manager,             # Руководитель
                  WindowsEmailAddress  # Email
    | Export-Csv -Path "C:\GAL_Detailed.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"

3.4 Только определённый отдел

PowerShell

Get-User -ResultSize Unlimited -Filter "Department -eq 'IT'" | 
    Select-Object DisplayName, UserPrincipalName, Title, Phone | 
    Export-Csv -Path "C:\GAL_IT_Department.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"

3.5 Группы рассылки

PowerShell

# Список всех групп
Get-DistributionGroup -ResultSize Unlimited | 
    Select-Object DisplayName, PrimarySmtpAddress, ManagedBy | 
    Export-Csv -Path "C:\GAL_Groups.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"

# Участники конкретной группы
Get-DistributionGroupMember -Identity "Название группы" | 
    Select-Object DisplayName, PrimarySmtpAddress | 
    Export-Csv -Path "C:\Group_Members.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"

4. Экспорт в другие форматы
В TXT (табуляция)

PowerShell

Get-Mailbox -ResultSize Unlimited | 
    Select-Object DisplayName, PrimarySmtpAddress, Department | 
    Export-Csv -Path "C:\GAL.txt" -NoTypeInformation -Encoding UTF8 -Delimiter "`t"

В простой текст (построчно)

PowerShell

Get-Mailbox -ResultSize Unlimited | 
    ForEach-Object { "$($_.DisplayName) — $($_.PrimarySmtpAddress)" } | 
    Out-File -FilePath "C:\GAL_simple.txt" -Encoding UTF8

В Excel напрямую (если установлен модуль ImportExcel)

PowerShell

Install-Module ImportExcel -Force -Scope CurrentUser

Get-User -ResultSize Unlimited | 
    Select-Object DisplayName, UserPrincipalName, Department, Title, Phone | 
    Export-Excel -Path "C:\GAL.xlsx" -AutoSize -TableName "GAL" -WorksheetName "Контакты"

5. После завершения — отключение

PowerShell

Disconnect-ExchangeOnline -Confirm:$false

6. Возможные проблемы и решения
Проблема	Решение
Нет прав на выполнение команд	Нужна роль Global Reader, Exchange Admin или хотя бы View-Only Recipients — обратитесь к IT-администратору
Ошибка при установке модуля	Запустите Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
Много записей, команда зависает	Добавьте -ResultSize 500 для теста, потом уберите лимит
Кракозябры в CSV	Откройте в Excel через Данные → Из текста и выберите кодировку UTF-8
Нет доступа к PowerShell	Попросите администратора выгрузить или используйте обходной путь (ниже)
7. Обходной путь (без PowerShell, без прав админа)

Если нет прав на PowerShell, можно через Outlook:

text

1. Outlook → Адресная книга (Ctrl+Shift+B)
2. Найдите нужные контакты в GAL
3. Выделите все (Ctrl+A)
4. Правой кнопкой → «Добавить в контакты» (Add to Contacts)
5. Контакты скопируются в вашу личную папку
6. Файл → Импорт/Экспорт → Экспорт в CSV

    ⚠️ Этот способ работает, но при большом количестве (тысячи) может быть медленным.

Быстрый старт — скопируй и запусти:

PowerShell

# === ПОЛНЫЙ СКРИПТ ДЛЯ КОПИРОВАНИЯ ===
Install-Module -Name ExchangeOnlineManagement -Force -Scope CurrentUser
Import-Module ExchangeOnlineManagement
Connect-ExchangeOnline

$path = "$env:USERPROFILE\Desktop\GAL_Export.csv"

Get-User -ResultSize Unlimited | 
    Select-Object DisplayName, WindowsEmailAddress, FirstName, LastName, 
                  Title, Department, Company, Office, Phone, MobilePhone, City | 
    Export-Csv -Path $path -NoTypeInformation -Encoding UTF8 -Delimiter ";"

Disconnect-ExchangeOnline -Confirm:$false

Write-Host "Файл сохранён на рабочий стол: $path" -ForegroundColor Green

Файл появится на рабочем столе. Если что-то не сработает — напишите текст ошибки, помогу разобраться.