import java.util.HashMap;
import java.util.Map;

class OrderProcessor {
    private Map<String, Integer> inventory;

    public OrderProcessor(Map<String, Integer> inventory) {
        this.inventory = inventory;
    }

    public void processOrder(Map<String, Integer> order) {
        for (Map.Entry<String, Integer> entry : order.entrySet()) {
            String item = entry.getKey();
            int quantity = entry.getValue();

            if (!inventory.containsKey(item)) {
                System.err.println("Error: " + item + " is not in inventory");
            } else if (inventory.get(item) < quantity) {
                System.err.println("Error: Not enough stock for " + item);
            } else {
                inventory.put(item, inventory.get(item) - quantity);
                System.out.println("Processed " + quantity + " of " + item);
            }
        }
    }

    public static void main(String[] args) {
        // Use HashMap instead of Map.of to allow mutability
        Map<String, Integer> inventory = new HashMap<>();
        inventory.put("apple", 10);
        inventory.put("banana", 5);
        inventory.put("cherry", 0);

        Map<String, Integer> order = new HashMap<>();
        order.put("apple", 3);
        order.put("banana", 6);
        order.put("cherry", 1);
        order.put("date", 2);

        OrderProcessor processor = new OrderProcessor(inventory);
        processor.processOrder(order);
    }
}