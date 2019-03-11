Feature: Notify team member of marked accounts

    As a subsriber
    I want to see notifications for all accounts marked for deletion
    So that I can take action if needed

    Rules:
    - Non sandbox accounts have an extra warning
    - Notification will state when account is scheduled to be deleted
    - Notifications are sent daily to slack
    - slack channel is configurable
    - one message indicating all accounts to be deleted

    @completed
    Scenario: I have a list of accounts marked for deletion
        Given I have a list of marked accounts of length 4
        And I have set my slack channel to "#slack-hook-test"
        When the notification service runs
        Then I should see 1 notification mentioning 4 accounts in the "#slack-hook-test" channel
        And I should also see the account name and id for each account

    @todo
    Scenario: Notifications should be bundled together
        Given I have the following accounts:
            | accountId | account name         | marked for deletion |
            | 12345678  | sandbox-1            | 01/01/2019          |
            | 22345678  | sandbox-2            | -                   |
            | 32345678  | datablaize           | 04/01/2019          |
            | 42345678  | my-important-account | -                   |
        When the notifications are sent on "05/01/2019"
        Then the notification should include:
            """
            The following accounts are scheduled for deletion:
            - sandbox-1 (12345678) on/after 8/1/2019    (3 days)
            - WARNING non-sandbox account: datablaize (32345678) on/after 11/1/2019  (6 days)
            """