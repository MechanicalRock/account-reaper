Feature: Remove all accounts marked for deletion

    As a DevOps engineer
    I want to be sure that all accounts marked for deletion will be deleted

    Rules:
    - Mark & Delete schedules are run weekly

    Scenario: Not enough time elapsed since marking
        Given Tim marks "JKs-account" for deletion on "01/01/2019"
        And JK was on holiday and is still using it
        When the delete schedule runs on "02/01/2019"
        Then "JKs-account" should not be deleted

    Scenario: Cleaning up all accounts marked for deletion
        Given a list of accounts has been marked for deletion 2 weeks ago
        When the Account Reaper runs
        Then the status of each account should indicate that is has been scheduled for deletion

    Scenario: Cleaning up old account
        Given account "datablaize" exits and I don't want it anymore
        And I have it marked for deletion
        When the Account Reaper runs
        Then the datablaize account should be deleted

    Scenario: Delete accounts marked more than 7 days ago
        Given today is "09/01/2019"
        When the Account Reaper runs
        Then 12345678, 22345678 should be scheduled for deletion
        But 32345678 should not be scheduled for deletion

            | Account Id | Data marked |
            | 12345678   | 1/1/2019    |
            | 22345678   | 2/1/2019    |
            | 32345678   | 7/1/2019    |
