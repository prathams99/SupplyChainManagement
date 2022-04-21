USE DMDDFinalProject;

-- Encryption

-- We use CREATE MASTER KEY statement for creating a database master key:
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'Justgowithit@123';

-- We can use sys.symmetric_keys catalog view to verify the existence of this database master key in SQL Server encryption:
SELECT name KeyName, 
    symmetric_key_id KeyID, 
    key_length KeyLength, 
    algorithm_desc KeyAlgorithm
FROM sys.symmetric_keys;


-- Creates a certificate:
CREATE CERTIFICATE Certificate_test WITH SUBJECT = 'Protect my data';
GO

-- verify the certificate using the catalog view sys.certificates:
SELECT name CertName, 
    certificate_id CertID, 
    pvt_key_encryption_type_desc EncryptType, 
    issuer_name Issuer
FROM sys.certificates;

-- Configure a symmetric key for column level SQL Server encryption
CREATE SYMMETRIC KEY SymKey_test WITH ALGORITHM = AES_256 ENCRYPTION BY CERTIFICATE Certificate_test;



-- existing keys using catalog view for column level SQL Server Encryption
SELECT name KeyName, 
    symmetric_key_id KeyID, 
    key_length KeyLength, 
    algorithm_desc KeyAlgorithm
FROM sys.symmetric_keys;



-- Data encryption
ALTER TABLE Payment
ADD CreditCard_encrypt varbinary(MAX)

SELECT * FROM PAYMENT;


-- open the symmetric key and decrypt using the certificate
OPEN SYMMETRIC KEY SymKey_test
        DECRYPTION BY CERTIFICATE Certificate_test;


UPDATE PAYMENT
        SET CreditCard_encrypt = EncryptByKey (Key_GUID('SymKey_test'), CONVERT(varbinary, CardNumber))
        FROM PAYMENT;
GO

-- Drop the column with the actual data
ALTER TABLE Payment
DROP COLUMN CreditCard;
GO


-- To decrypt the data
OPEN SYMMETRIC KEY SymKey_test
        DECRYPTION BY CERTIFICATE Certificate_test;

-- To view the decrypted data
SELECT PaymentID, Payment_Mode,CreditCard_encrypt AS 'Encrypted data',
            CONVERT(BIGINT, DecryptByKey(CreditCard_encrypt)) AS 'Decrypted Credit Card number'
            FROM PAYMENT;



SELECT * FROM CUSTOMER;
-- Encrypting the SSN of Customer
ALTER TABLE Customer
ADD SSN_encrypt varbinary(MAX)


-- open the symmetric key and decrypt using the certificate
OPEN SYMMETRIC KEY SymKey_test
        DECRYPTION BY CERTIFICATE Certificate_test;


UPDATE CUSTOMER
        SET SSN_encrypt = EncryptByKey (Key_GUID('SymKey_test'), CONVERT(varbinary, SSN))
        FROM CUSTOMER;
GO

-- Drop the column with the actual data
ALTER TABLE Customer
DROP COLUMN SSN;
GO


-- To decrypt the data
OPEN SYMMETRIC KEY SymKey_test
        DECRYPTION BY CERTIFICATE Certificate_test;

-- To view the decrypted data
SELECT CustID, Name,SSN_encrypt AS 'Encrypted data',
            CONVERT(INT, DecryptByKey(SSN_encrypt)) AS 'Decrypted SSN'
            FROM CUSTOMER;