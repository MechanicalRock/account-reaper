Feature: Marking Accounts

    As a DevOps engineer
    I want to delete all sandbox accounts periodically

    Rules:
    - Sandbox accounts older than 30 days are marked for deletion
    - Any account can be marked for deletion manually

    @completed
    Scenario: Marking an old sandbox account
        Given account "sandbox-tim.myerscough" was created on "January 1, 2019"
        And today is "February 1, 2019"
        When Account Reaper runs
        Then account "sandbox-tim.myerscough" should be marked for deletion

    @completed
    Scenario: A persistent account
        Given account "quickmail-client" was created on "January 1, 2019"
        And today is "February 1, 2019"
        When Account Reaper runs
        Then account "quickmail-client" should not be marked for deletion

    @completed
    Scenario: Sandbox account misnamed
        Given account "tim-sandbox" was created on "January 1, 2019"
        And today is "February 1, 2019"
        When Account Reaper runs
        Then account "tim-sandbox" should be marked for deletion

    @completed
    Scenario: Sandbox account is less than 30 days old
        Given account "my-sandbox" was created on "January 1, 2019"
        And today is "January 15, 2019"
        When Account Reaper runs
        Then account "my-sandbox" should not be marked for deletion

    @dev
    Scenario: Marking a non-sandbox account for deletion
        Given I have an account "quickmail"
        When I mark "quickmail" for deletion
        Then I should see a notification indicating that "quickmail" has been marked for deletion
        And I should see the date it will be deleted on

    @dev
    Scenario: I want to mark an account for deletion that doesn't exist
        Given I have an account "quickmail"
        When I mark "quickmail" for deletion
        Then I should receive an error message stating the specified account does not exist
