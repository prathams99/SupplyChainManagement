CREATE TRIGGER emailAlertToCustomer ON OUTAGES
FOR INSERT
AS
    DECLARE @recipientList varchar(MAX)
    SET @recipientList = (STUFF((SELECT ';' + email FROM customer WHERE zipcode IN 
    (SELECT zipcode from INSERTED I) FOR XML PATH('')),1,1,''))
    
    DECLARE @outTTR FLOAT
    select @outTTR=avg(Outage_ttr) 
	FROM OUTAGES WHERE zipcode IN (SELECT zipcode from INSERTED I)

    DECLARE @emailBody VARCHAR(MAX)
    SET @emailBody= 'There is an outage in your area. The planned time of crew arrival is :' + ISNULL(STR(@outTTR) + 'minutes','Unavailable')
    EXEC msdb.dbo.sp_send_dbmail
    @profile_name = 'DMDDFinalProject',
    @recipients = @recipientList,
    @subject = 'Power Outage in your area',
    @body = @emailBody
	PRINT 'Email has been sent to intimate customers'

-- Queries below to test out the Triggers
-- INSERT INTO CUSTOMER (CustID,Name,Contact,Email,IsActive,DateOfBirth,SSN,State,City,Address,Zipcode) VALUES
-- ('CUST_0000000301','Shika Shyam',6175106560,'shika.shyam14@gmail.com',1,'1996-07-14',123456789,'Massachusetts','Boston','5 Iroquois St','21200'),
-- ('CUST_0000000302','Alisha Mary Angalan',6175106560,'alishamary96@gmail.com',1,'1996-05-14',123456789,'Massachusetts','Boston','6 Iroquois St','21200');

-- INSERT INTO OUTAGES (OutageID,EquipmentID,EventID,Start_Time,End_Time,Priority,Outage_Type,ZipCode) VALUES
-- ('OUTAGE_0000000300',NULL,'EVENT_00000001','2019-02-11 20:45:00','2019-02-11 23:50:00',1,'Planned','21200');

-- select * from outages where outageid='OUTAGE_0000000300'
-- delete from customer where custID in ('CUST_0000000301','CUST_0000000302');
GO

CREATE TRIGGER addOutageForComplaint ON CUSTOMER_COMPLAINTS
FOR INSERT
AS
    DECLARE @lastrec INT
    DECLARE @newoutageid VARCHAR(35)
    DECLARE @equipmentid VARCHAR(35)
    DECLARE @zipcode VARCHAR(12)
    SELECT @lastrec=MAX(CAST(SUBSTRING(OutageID,8,100) AS INT)) FROM OUTAGES
    SET @newoutageid='OUTAGE_0000000'+LTRIM(STR(@lastrec+1))

    SELECT @equipmentid=AE.EquipmentID FROM ACCOUNT_EQUIPMENT AE JOIN ACCOUNT A 
    ON A.AccountID=AE.AccountID 
    WHERE A.CustID=(SELECT CustID from inserted i)

    SELECT @zipcode=zipcode FROM CUSTOMER WHERE CustID=(SELECT CustID from inserted i)

    INSERT INTO OUTAGES (OutageID,EquipmentID,EventID,Start_Time,End_Time,Priority,Outage_Type,ZipCode) VALUES
    (@newoutageid,@equipmentid,NULL,GETDATE(),NULL,1,'Unplanned',@zipcode) 
    PRINT 'New Outage record added - Outage ID :' + @newoutageid
    UPDATE Customer_Complaints SET OutageID=@newoutageid WHERE ComplaintID=(SELECT ComplaintID from inserted i)



--Below is the query to test out this trigger
-- INSERT INTO CUSTOMER_COMPLAINTS (ComplaintID, CustID, Comments, Complaint_Type, OutageID) VALUES
-- ('COMPLAINT_000000031','CUST_000000030','Meter needs replacement','Feedback',NULL)

