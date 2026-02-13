from PolicyLogic import PolicyWarRoom

def test_grading():
    room = PolicyWarRoom("Test Scenario")
    
    # Test Level 1
    l1, _ = room.grade_policy("Help them out.")
    print(f"Level 1 Test: {l1}")
    
    # Test Level 2
    l2, _ = room.grade_policy("The UN Security Council should implement a fund to target poverty in order to improve stability.")
    print(f"Level 2 Test: {l2}")
    
    # Test Level 3
    l3, _ = room.grade_policy("The UN Security Council should implement a fund to target poverty in order to improve stability. However, there is a risk of corruption which must be mitigated by NGO oversight.")
    print(f"Level 3 Test: {l3}")

if __name__ == "__main__":
    test_grading()
