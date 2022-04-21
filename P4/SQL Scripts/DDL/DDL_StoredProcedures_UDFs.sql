--Stored Procedure to Get Number of Customers affected by an Outage given the ZipCode
GO
CREATE PROCEDURE GetNumCustAffected @zipcode VARCHAR(10), @numcust INT OUTPUT
AS
BEGIN
SELECT @numcust=COUNT(DISTINCT A.CustID) FROM
(SELECT AE.AccountID FROM OUTAGES O 
JOIN Account_Equipment AE ON
O.EquipmentID=AE.EquipmentID
WHERE O.ZipCode=@zipcode)O
JOIN Account A 
ON A.AccountID=O.AccountID
END
GO 

-- Queries below to test the Stored Procedure
-- DECLARE @numcust INT
-- EXEC GetNumCustAffected '80223', @numcust OUTPUT
-- PRINT CONCAT('Number of customers affected : ',@numcust)


--Stored Procedure to get number of Outages and Number of Customers affected by a category of Event
CREATE PROCEDURE GetNumOutNumCust @eventcat VARCHAR(50),@numout INT OUTPUT, @numcust INT OUTPUT
AS 
BEGIN
SELECT @numout=count(*) FROM OUTAGES 
WHERE EventID IN (SELECT EventID FROM WEATHER_EVENTS WHERE Event_Category=@eventcat)
SELECT @numcust=COUNT(DISTINCT A.CustID) FROM
(SELECT AE.AccountID FROM OUTAGES O 
JOIN Account_Equipment AE ON
O.EquipmentID=AE.EquipmentID
WHERE O.EventID IN (SELECT EventID FROM WEATHER_EVENTS WHERE Event_Category=@eventcat))O
JOIN Account A 
ON A.AccountID=O.AccountID
END

-- Queries below to test the Stored Procedure
-- DECLARE @numcust INT
-- DECLARE @numout INT
-- EXEC GetNumOutNumCust 'Shika', @numout OUTPUT, @numcust OUTPUT
-- PRINT CONCAT('Number of customers affected : ',@numcust)
-- PRINT CONCAT('Number of outages: ',@numout)

--Stored Procedure to get Average Bill amount and consumption units for a given customer ID

GO
CREATE PROCEDURE GetAvgBillConsumption @custname VARCHAR(40), @avgbill FLOAT OUTPUT, @avgconsumption FLOAT OUTPUT
AS
BEGIN
SELECT @avgbill=AVG(Bill_Amount),@avgconsumption=AVG(Consumption_Units)
FROM Account A JOIN METER_READING MR 
ON MR.AccountID=A.AccountID
JOIN BILL B 
ON B.MeterID=MR.MeterID
JOIN Customer C 
ON C.CustID=A.CustID
WHERE C.Name=@custname
GROUP BY C.CustID
END

-- Queries below to test the Stored Procedure
-- DECLARE @avgbill FLOAT
-- DECLARE @avgconsumption FLOAT
-- EXEC GetAvgBillConsumption 'Ada Songhurst', @avgbill OUTPUT,@avgconsumption OUTPUT
-- PRINT CONCAT('AVG BILL : $', @avgbill)
-- PRINT CONCAT('AVG CONSUMPTION : ' ,@avgconsumption,' units')


-- User defined function to get billAmount from meter and associated meter reading. Used to populate Bill Amount column in BILL table
GO

CREATE FUNCTION dbo.GetBillAmount (@meterid VARCHAR(25))
RETURNS FLOAT
AS
BEGIN
    DECLARE @unitconsumption INT
    DECLARE @billamt FLOAT
    SELECT @unitconsumption=Consumption_Units FROM METER_READING
    WHERE MeterID=@meterid

SET @billamt=@unitconsumption*2.1046
RETURN @billamt
END

--User Defined function to get Outage Time to restore (OutageTTR) for a given outage. Outage TTR is the time taken for a crew to be assigned to an outage once reported.
-- This UDF is used to populate column OutageTTR in OUTAGES Table.
GO
CREATE FUNCTION dbo.getOutageTTR (@outageid VARCHAR(25))
RETURNS FLOAT
AS
BEGIN
    DECLARE @outagettr INT
    DECLARE @starttime DATETIME
    DECLARE @assigndatetime DATETIME
    IF EXISTS (SELECT AssignedDateTime FROM CREW_ASSIGNMENTS
    WHERE OutageID=@outageid)
    BEGIN
    SELECT @assigndatetime = AssignedDateTime FROM CREW_ASSIGNMENTS
    WHERE OutageID=@outageid
    SELECT @starttime=Start_Time FROM OUTAGES 
    WHERE OutageID=@outageid
    SET @outagettr = DATEDIFF(MINUTE,@starttime,@assigndatetime)    
    END
    ELSE
    SET @outagettr=NULL
RETURN @outagettr
END


-- User defined function to check the format of email for validity. This is used since our database system has the function of sending emails to customers.
-- This UDF is used in the CHECK constraint for Email column in CUSTOMER table.

GO
CREATE FUNCTION ChkValidEmail(@EMAIL varchar(100))RETURNS bit as
BEGIN
  DECLARE @bitEmailVal as Bit
  DECLARE @EmailText varchar(100)

  SET @EmailText=ltrim(rtrim(isnull(@EMAIL,'')))

  SET @bitEmailVal = case when @EmailText = '' then 1
                          when @EmailText like '% %' then 0
                          when @EmailText like ('%["(),:;<>\]%') then 0
                          when substring(@EmailText,charindex('@',@EmailText),len(@EmailText)) like ('%[!#$%&*+/=?^`_{|]%') then 0
                          when (left(@EmailText,1) like ('[-_.+]') or right(@EmailText,1) like ('[-_.+]')) then 0                                                                                    
                          when (@EmailText like '%[%' or @EmailText like '%]%') then 0
                          when @EmailText LIKE '%@%@%' then 0
                          when @EmailText NOT LIKE '_%@_%._%' then 0
                          else 1 
                      end
  RETURN @bitEmailVal
END 
GO


